package com.example.starlingui.service;

import com.example.starlingui.model.K8sContainer;
import io.kubernetes.client.PodLogs;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.util.Config;
import io.kubernetes.client.util.Streams;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.io.InputStream;

import java.util.Map;
import java.util.stream.Stream;

public class ContainerLogsConnection implements Runnable {


    // the class which socket use to communicate with the frontend.
    private final WebSocketSession session;

    // the container which we want to monitor its logs.
    private final K8sContainer container;

    private boolean running = true;


    public ContainerLogsConnection(Map<String, String> paramMap, WebSocketSession session) {
        this.session = session;
        this.container = new K8sContainer();
        container.setContainerName(paramMap.get("container"));
        container.setNamespace(paramMap.get("namespace"));
        container.setPodName(paramMap.get("name"));
    }



    @Override
    public void run() {
        try {
            LogsConnection();
        } catch (IOException | ApiException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }


    public void LogsConnection() throws IOException, ApiException, InterruptedException {
        String podName = container.getPodName();
        String namespace = container.getNamespace();
        String containerName = container.getContainerName();


        PodLogs logs = new PodLogs();
        //Streams.copy(is, System.out);

        InputStream logContent = logs.streamNamespacedPodLog(namespace, podName, containerName);

        try {
            while (running) {
                byte[] data = new byte[1024];
                if (logContent.read(data) != -1) {
                    //transform logContent into textMessage.
                    TextMessage textMessage = new TextMessage(data);
                    //send Message to the frontend.
                    session.sendMessage(textMessage);
                }
            }
            logContent.close();
        } catch (IOException e) {
            System.out.println("Pipe closed");
        } finally {
            System.out.println("session closed... exit thread");
        }
    }

    public boolean getRunningStatus(){
        return running;
    }

    public void setRunningStatus(boolean status){
        running = status;
    }

}
