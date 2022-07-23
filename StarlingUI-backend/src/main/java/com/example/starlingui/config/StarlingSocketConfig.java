package com.example.starlingui.config;


import com.example.starlingui.controller.MonitorLogsHandler;
import com.example.starlingui.controller.StarlingShellSocketHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.annotation.Resource;

@Configuration
@EnableWebSocket
public class StarlingSocketConfig implements WebSocketConfigurer {

    @Resource
    private StarlingShellSocketHandler StarlingShellSocketHandler;
    @Resource
    private MonitorLogsHandler MonitorLogsHandler;
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        //告诉框架，哪个路径是WebSocket的路径，哪个对象用来处理连接和接收信息
        //按照下面配置过之后，可以通过ws://localhost:8080/container/shell来连接。
        //指定Handler处理器和路径，并设置跨域
        registry.addHandler(StarlingShellSocketHandler, "/container/shell")
                .addHandler(MonitorLogsHandler, "/container/logs")
                .setAllowedOrigins("*");
    }

    @Bean
    public TextWebSocketHandler webSocketHandler(){
        return new StarlingShellSocketHandler();
    }
    @Bean
    public TextWebSocketHandler webSocketHandler2(){
        return new MonitorLogsHandler();
    }
}
