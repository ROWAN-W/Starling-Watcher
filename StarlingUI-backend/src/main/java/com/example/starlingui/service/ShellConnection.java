package com.example.starlingui.service;


import com.example.starlingui.model.K8sContainer;
import io.kubernetes.client.Exec;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.util.Config;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

//Java中实现多线程有两种方法：继承Thread类、实现Runnable接口，在程序开发中只要是多线程，肯定永远以实现Runnable接口为主
public class ShellConnection implements Runnable {

    //将command传入container shell里
    private OutputStream outputStream;

    private InputStream inputStream;

    //k8s api，一个shell就是一个exec
    private final Exec exec;

    //socket用来与前端沟通的类
    private final WebSocketSession session;

    //要开启shell的container
    private final K8sContainer container;

    private final String cols;

    private final String rows;

    private Process proc;


    private Boolean tryBash = false;

    private Boolean running = true;

    public ShellConnection(Map<String, String> paramMap, WebSocketSession session) {
        this.session = session;
        this.exec = new Exec();
        this.container = new K8sContainer();
        container.setContainerName(paramMap.get("container"));
        container.setNamespace(paramMap.get("namespace"));
        container.setPodName(paramMap.get("name"));
        this.cols = paramMap.get("cols");
        this.rows = paramMap.get("rows");
    }


    //run方法代表每个线程必须执行的任务
    @Override
    public void run() {
        List<String> shellType = Arrays.asList("/bin/bash", "/bin/sh");
        shellType.forEach((s) -> {
            if (!tryBash) {
                try {
                    execShell(s);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }
        );
        TextMessage textMessage = new TextMessage("container is not /bin/bash or /bin/sh");
        try {
            session.sendMessage(textMessage);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void execShell(String shellType) throws IOException {
        String podName = container.getPodName();
        String namespace = container.getNamespace();
        String containerName = container.getContainerName();



        boolean tty = true;
        boolean initValid = true;

        try {
            //打开container shell
            proc = exec.exec(namespace, podName, new String[]{shellType}, containerName, true, tty);
            //获得shell的输入和输出
            outputStream = proc.getOutputStream();
            //用来读取K8s container shell里返回的信息
            inputStream = proc.getInputStream();
            //设置shell的大小
            String width = "COLUMNS=" + cols;
            String height = "LINES=" + rows;
            String export = "export " + width + height + ";";
            String cmdArgs = export + shellType + "\nclear\n";
            outputStream.write(cmdArgs.getBytes());
            //获取每个命令的执行结果输出在前端的终端
        } catch (ApiException | IOException e) {
            e.printStackTrace();
            try {
                session.close();
            } catch (IOException e1) {
                e1.printStackTrace();
            }
        }

        try {
            while (running) {
                    byte[] data = new byte[1024];
                    if (inputStream.read(data) != -1) {
                        //将实际的shell的输出写入textMessage
                        TextMessage textMessage = new TextMessage(data);
                        //检测shell是否启动成功，都是ture则启动不成功
                        if (initValid && isValidBash(textMessage)) {
                            break;
                        } else {
                            tryBash = true;
                            initValid = false;
                        }
                        //向前端发送结果
                        session.sendMessage(textMessage);
                    }
            }
        } catch (IOException e) {
            System.out.println("Pipe closed");
        } finally {
            exit();
            System.out.println("session closed... exit thread");
        }

    }

    //验证shell
    private boolean isValidBash(TextMessage textMessage) {
        //如果shell返回的信息如下，说明shell没有启动成功
        String failMessage = "OCI runtime exec failed";
        return textMessage.getPayload().trim().contains(failMessage);
    }

    //退出 Process
    public void exit() throws IOException {
        if (proc != null) {
            proc.destroy();
            inputStream.close();
            outputStream.close();
        }
    }

    public OutputStream getOutputStream() {
        return outputStream;
    }

    public void setRunning(){
        running = false;
    }

}
