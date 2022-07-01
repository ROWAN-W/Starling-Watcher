package com.example.starlingui;

import com.example.starlingui.model.User;
import com.google.gson.Gson;
import org.junit.Before;
import org.junit.Test;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


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
}
