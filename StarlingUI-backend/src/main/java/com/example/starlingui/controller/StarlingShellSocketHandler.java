package com.example.starlingui.controller;

import com.example.starlingui.service.ShellConnection;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
public class StarlingShellSocketHandler extends TextWebSocketHandler {

    // 同时存在最多100个shell线程,设置线程池的上限
    private static final int ThreadPoolSize = 100;

    // 线程池接口,创建一个可缓存线程池,用来执行线程
    // 如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，否则新建线程。（线程最大并发数不可控制）
    private static final ExecutorService threadPoolExecutor = Executors.newCachedThreadPool();

    // HashMap 是线程不安全的,ConcurrentHashMap是专门用来存放线程的HashMap
    // 每一个socket都会有一个session用来区别
    private static final ConcurrentHashMap<WebSocketSession, ShellConnection> shellConnectionMap= new ConcurrentHashMap<>();


    public StarlingShellSocketHandler(){

    }


    /**
     * 建立连接时触发
     */
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        System.out.println(shellConnectionMap.size());
        //线程超过数量，则不会开启新shell
        if(shellConnectionMap.size()<ThreadPoolSize){
            if(!shellConnectionMap.containsKey(session)){
                //新建线程
                ShellConnection shellConnection = new ShellConnection(getParam(session.getUri()),session);
                //放入存放线程的HashMap
                shellConnectionMap.put(session,shellConnection);
                //执行线程
                threadPoolExecutor.submit(shellConnection);
            }
        }else {
            //往前端发送消息，线程池已经满了，无法开启shell
            TextMessage textMessage = new TextMessage("thread pool is full".getBytes());
            session.sendMessage(textMessage);
        }


    }

    /**
     * 关闭连接时触发
     */
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        if(shellConnectionMap.containsKey(session)){
            shellConnectionMap.get(session).setRunning();
            shellConnectionMap.get(session).exit();
            shellConnectionMap.remove(session);
        }

    }

    /**
     * 前端调用websocket.send时候，会调用该方法
     */
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception{
        if(shellConnectionMap.containsKey(session)){
            shellConnectionMap.get(session).getOutputStream().write(message.getPayload().getBytes());
        }
        super.handleTextMessage(session,message);

    }


    /**
     * error时触发
     */
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception{
        if(session.isOpen()){
            session.close();
        }
        if(shellConnectionMap.containsKey(session)){
            shellConnectionMap.get(session).exit();
            shellConnectionMap.remove(session);
        }

    }

    public boolean supportsPartialMessages() {
        return false;
    }

    //get socket地址里的参数
    private Map<String, String> getParam(URI uri) {
        Map<String, String> queryPairs = new LinkedHashMap<>();
        String query = uri.getQuery();
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            queryPairs.put(URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8), URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8));
        }
        return queryPairs;
    }
}
