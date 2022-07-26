package com.example.starlingui.controller;

import com.example.starlingui.service.ContainerLogsConnection;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


@Component
public class MonitorLogsHandler extends TextWebSocketHandler {

    // The size limitation of the tread pool is 100.
    private static final int ThreadPoolSize = 100;

    // Create a pool of threads that can be cached and used to execute threads.
    private static final ExecutorService threadPoolExecutor = Executors.newCachedThreadPool();

    // ConcurrentHashMap is a HashMap specifically designed to store threads.
    // every socket has its own unique session.
    private static final ConcurrentHashMap<WebSocketSession, ContainerLogsConnection> LogsConnectionMap = new ConcurrentHashMap<>();

    public MonitorLogsHandler(){}


    /**
     * Establish the connection
     */
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        System.out.println(LogsConnectionMap.size());
        //whether the thread number larger than pool size or not
        if(LogsConnectionMap.size() < ThreadPoolSize){
            //if it's a new session then build a new thread
            if(!LogsConnectionMap.containsKey(session)){
                ContainerLogsConnection LogsConnection = new ContainerLogsConnection(getParam(session.getUri()),session);
                //put the new thread into the HashMap
                LogsConnectionMap.put(session,LogsConnection);
                //execute the threads
                threadPoolExecutor.submit(LogsConnection);
            }
        }else {
            //if the pool has been full then send a message to the frontend.
            TextMessage textMessage = new TextMessage("thread pool is full".getBytes());
            session.sendMessage(textMessage);
        }


    }

    /**
     * close and remove the connection of session
     */
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws IOException {
        if(LogsConnectionMap.containsKey(session)) {
            LogsConnectionMap.get(session).setRunningStatus(false);
            LogsConnectionMap.remove(session);
        }
        threadPoolExecutor.shutdown();
        System.out.println("logs close");
    }


    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception{


    }

    /**
     * error handler
     */
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception{
        if(session.isOpen()){
            session.close();
        }
        if(LogsConnectionMap.containsKey(session)) {
            LogsConnectionMap.get(session).setRunningStatus(false);
            LogsConnectionMap.remove(session);
        }
    }

    public boolean supportsPartialMessages() {
        return false;
    }

    //get variables from socket uri
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


