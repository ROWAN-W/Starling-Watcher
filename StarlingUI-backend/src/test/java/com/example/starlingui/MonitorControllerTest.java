package com.example.starlingui;


import com.example.starlingui.model.User;
import com.example.starlingui.model.monitorContainer;
import com.google.gson.Gson;


import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Pod;
import io.kubernetes.client.openapi.models.V1PodList;
import io.kubernetes.client.util.Config;
import org.junit.Before;
import org.junit.Test;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultMatcher;

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.*;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;


import com.example.starlingui.service.uploadYAMLServiceImpl;


@RunWith(SpringRunner.class)
@SpringBootTest
public class MonitorControllerTest {

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }



    //prerequisite: a minikube cluster with at least on pod
    @Test
    public void testRestartPod(){

        try {
            ApiClient client = Config.defaultClient();
            Configuration.setDefaultApiClient(client);

            CoreV1Api api = new CoreV1Api(client);
            V1PodList podList = api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null, null);

            int size=podList.getItems().size();

            if(size>0){
                //delete the first pod
                V1Pod pod=podList.getItems().get(1);
                mockMvc.perform(delete("http://localhost:8080/monitor/restart/"+pod.getMetadata().getNamespace()+"/"+pod.getMetadata().getName()))
                        .andDo(print())
                        .andExpect(status().isOk())
                        .andReturn().getResponse().getContentAsString();


                TimeUnit.SECONDS.sleep(3);

                //check the deleted pod is not in the cluster anymore
                mockMvc.perform(delete("http://localhost:8080/monitor/restart/"+pod.getMetadata().getNamespace()+"/"+pod.getMetadata().getName()))
                        .andDo(print())
                        .andExpect(status().is4xxClientError())
                        .andReturn().getResponse().getContentAsString();

                //check that a replacing pod has been started
                V1PodList newPodList = api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null, null);
                assertEquals(size, newPodList.getItems().size());

            }


        }catch (Exception exception){
            throw new RuntimeException(exception.getMessage());
        }
    }



}
