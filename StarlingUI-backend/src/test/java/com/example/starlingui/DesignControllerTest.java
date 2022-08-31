package com.example.starlingui;

import com.example.starlingui.exceptions.StarlingException;
import com.example.starlingui.model.User;
import com.example.starlingui.model.monitorNode;
import com.example.starlingui.model.monitorPod;
import com.google.gson.Gson;


import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Node;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.*;
import java.util.ArrayList;


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
    public void testUploadController() throws Exception {
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
        //test pod "nginx" is running
        // default config for an out-of-cluster client
        ApiClient client = Config.defaultClient();
        Configuration.setDefaultApiClient(client);
        client.setConnectTimeout(5000);
        CoreV1Api api = new CoreV1Api(client);
        ArrayList<monitorPod> monitorPods =new ArrayList<>();
        V1PodList list=api.listPodForAllNamespaces(null,null,null,null,null,null,null,null,null,null);
        //check if pod "nginx" is up and running
        boolean test=false;
        for (V1Pod item : list.getItems()) {
            if(item.getMetadata().getName().contains("nginx")){
                test=true;}
        }
        assertTrue(test);
    }


    @Test public void testValidTemplating() throws Exception {
        String fileName = "Project_JSON_valid_template.jsonc";
        Resource fileResource = new ClassPathResource(fileName);
        assertNotNull(fileResource);
        String projectJson = new Scanner(new File(fileName)).useDelimiter("\\Z").next();
        JSONObject validProject = new JSONObject(projectJson);
        
        //The Templating API should return 200 status code.
        mockMvc.perform(post("/design/templating")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validProject.toString()))
                .andDo(print())
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        //After successful deploying, we should retrieve the data from Kubernetes to check if the pod spec is correct.
        try {
            ApiClient client = Config.defaultClient();
            Configuration.setDefaultApiClient(client);

            CoreV1Api api = new CoreV1Api(client);
            V1PodList podList = api.listNamespacedPod("project1",null, null, null, null, null, null, null, null, null, null);

            int size = podList.getItems().size();
            if (size > 0) {
                V1Pod pod = podList.getItems().get(0);
                V1Container container = pod.getSpec().getContainers().get(0);
                assertEquals("charaznablegundam-testdevelop-api-v2", container.getName());
                assertEquals("charaznablegundam/testdevelop_api:v2", container.getImage());
                assertEquals("[aaa]", container.getArgs().toString());
                assertEquals("[aaa]", container.getCommand().toString());
                assertEquals("Always", container.getImagePullPolicy());
                assertEquals("aaa", Objects.requireNonNull(container.getEnv()).get(0).getName());
                assertEquals("aaa", Objects.requireNonNull(container.getEnv().get(0).getValue()));
                assertEquals(1234, Objects.requireNonNull(container.getPorts()).get(0).getContainerPort());
                assertEquals("TCP", Objects.requireNonNull(container.getPorts().get(0).getProtocol()));
            }
        }catch (Exception exception){
            throw new RuntimeException(exception.getMessage());
        }
    }

    
    @Test public void testInvalidTemplating() throws Exception {
        String fileName = "Project_JSON_invalid_template.jsonc";
        Resource fileResource = new ClassPathResource(fileName);
        assertNotNull(fileResource);
        String projectJson = new Scanner(new File(fileName)).useDelimiter("\\Z").next();
        JSONObject invalidProject = new JSONObject(projectJson);
        
        //The Templating API should return 400 status code.
        mockMvc.perform(post("/design/templating")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidProject.toString()))
                .andDo(print())
                .andExpect(status().is4xxClientError())
                .andReturn().getResponse().getContentAsString();
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

    }


//prerequisite: a freshly started kubernetes cluster without a former sample.yaml deployment
    @Test public void testYamlDeployer() throws Exception{
        uploadYAMLServiceImpl upload=new uploadYAMLServiceImpl();
            // validate yaml file
            File file = new File("Yaml" + File.separator + "sample.yaml");
            assertDoesNotThrow(()->{
                //validate the YAML file
                upload.validateYAML(file);
                // deploy the yaml file to namespace "default"
                upload.deployYAML(file, "default");
            });

        // default config for an out-of-cluster client
        ApiClient client = Config.defaultClient();
        Configuration.setDefaultApiClient(client);
        client.setConnectTimeout(5000);
        CoreV1Api api = new CoreV1Api(client);
        ArrayList<monitorPod> monitorPods =new ArrayList<>();
        V1PodList list=api.listPodForAllNamespaces(null,null,null,null,null,null,null,null,null,null);
        //check if pod "nginx" is up and running
        boolean test=false;
        for (V1Pod item : list.getItems()) {
            if(item.getMetadata().getName().contains("nginx")){
                test=true;}
        }
        assertTrue(test);
    }







    }


