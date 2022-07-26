package com.example.starlingui;

import com.example.starlingui.exceptions.StarlingException;
import com.example.starlingui.model.User;
import com.google.gson.Gson;


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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.*;



import com.example.starlingui.service.uploadYAMLServiceImpl;


@RunWith(SpringRunner.class)
@SpringBootTest
public class DesignControllerTest {
    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }


    @Test
    public void testRightUser() throws Exception {
        User user = new User("charaznablegundam", "362514hao");
        String testUser = new Gson().toJson(user);
        mockMvc.perform(post("/design/images")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(testUser))      // 设置数据格式
                .andDo(print())     // 打印输出发出请求的详细信息
                .andExpect(status().isOk())     // 对返回值进行断言
                .andReturn().getResponse().getContentAsString();

    }

    @Test
    public void testWrongUser() throws Exception {
        User user = new User("charaznablegundam", "362514ao");
        String testUser = new Gson().toJson(user);
        mockMvc.perform(post("/design/images")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(testUser))
                .andDo(print())
                .andExpect(status().is4xxClientError())
                .andReturn().getResponse().getContentAsString();

    }

    @Test
    public void testEmptyUser() throws Exception {
        User user = new User("OshiaCHEN", "4&PxDwTMns2YSa7");
        String testUser = new Gson().toJson(user);
        mockMvc.perform(post("/design/images")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(testUser))
                .andDo(print())
                .andExpect(status().is4xxClientError())
                .andReturn().getResponse().getContentAsString();

    }



    //prerequisite: a freshly started kubernetes cluster without a former sample.yaml deployment
    @Test
    public void testController() throws Exception {
        ResultMatcher ok = MockMvcResultMatchers.status().isOk();

        String fileName = "k8.ros_monitor.amd64.yaml";
        File file = new File( "Yaml"+File.separator+fileName);

        Resource fileResource = new ClassPathResource("Yaml"+File.separator+fileName);

        assertNotNull(fileResource);

        MockMultipartFile firstFile = new MockMultipartFile(
                "file",file.getName(),
                MediaType.MULTIPART_FORM_DATA_VALUE,
                new BufferedInputStream(new FileInputStream(file)));


        // deployed sample.yaml
        MvcResult andReturn = mockMvc.perform(MockMvcRequestBuilders
                        .multipart("http://localhost:8080/design/upload")
                        .file(firstFile).param("namespace", "default"))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn();

        //test that sample.yaml is already deployed
        MvcResult andReturnFalse = mockMvc.perform(MockMvcRequestBuilders
                .multipart("http://localhost:8080/design/upload")
           .file(firstFile).param("namespace", "default"))
            .andDo(print())
                .andExpect(status().is4xxClientError())
                .andReturn();

    }






    @Test public void testYamlValidator(){

      uploadYAMLServiceImpl upload=new uploadYAMLServiceImpl();


      // test valid yaml file
      File file=new File( "Yaml" +File.separator+"sample.yaml");
      try{upload.validateYAML(file);}catch (Exception e){
          fail("Should not have thrown any exception");
      }

      // test invalid yaml file
        File invalidFile=new File( "Yaml" +File.separator+"invalidSample.yaml");
        StarlingException thrown = assertThrows(
                StarlingException.class,
                () -> upload.validateYAML(invalidFile),
                "Expected validateYAML() to throw, but it didn't"
        );

        assertTrue(thrown.getMessage().contains("Stuff"));

    }
/*
//prerequisite: a freshly started kubernetes cluster without a former sample.yaml deployment
    @Test public void testYamlDeployer(){

        uploadYMLServiceImpl upload=new uploadYMLServiceImpl();


        // test valid yaml file
        File file=new File( "Yaml" +File.separator+"sample.yaml");
        assertTrue(upload.validateYML(file));


        // deploy the yaml file
        assertTrue(upload.deployYML(file));


    }

 */





    }


