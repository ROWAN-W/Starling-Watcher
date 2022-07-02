package com.example.starlingui;

import com.example.starlingui.service.designNodeServiceImpl;
import io.kubernetes.client.openapi.ApiException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;


@SpringBootApplication
public class StarlingUiApplication {
    @Bean
    public RestTemplate restTemplate() {
        RestTemplateBuilder restTemplateBuilder = new RestTemplateBuilder();
        return restTemplateBuilder.build();
    }

    public static void main(String[] args) {

        SpringApplication.run(StarlingUiApplication.class, args);
    }

}
