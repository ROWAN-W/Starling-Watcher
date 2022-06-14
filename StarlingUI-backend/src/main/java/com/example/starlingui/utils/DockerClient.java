package com.example.starlingui.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.starlingui.model.Image;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class DockerClient {

    private final AtomicLong counter = new AtomicLong();

    @Resource
    private RestTemplate restTemplate;

    @Resource
    private HttpHeaders headers;

    private final String accountUrl = "https://registry.hub.docker.com/v2/repositories/";

    private final String token;

    private final String username;

    public DockerClient(JSONObject user) {
        this.username = user.getString("username");
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(user.toJSONString(), headers);
        String loginUrl = "https://hub.docker.com/v2/users/login";
        ResponseEntity<String> result = restTemplate.postForEntity(loginUrl, request, String.class);
        JSONObject token = JSONObject.parseObject(result.getBody());
        this.token = "Bearer " + token.getString("token");
    }

    public List<Image> getImageList(){
        headers.set("Authorization", token);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                accountUrl+username, HttpMethod.GET, requestEntity, String.class);
        JSONObject jsonobject = JSONObject.parseObject(response.getBody());
        JSONArray images = jsonobject.getJSONArray("results");
        List<Image> imageList = new ArrayList<>();
        for(int i = 0; i < images.size();i++){
            imageList.addAll(getImageTag(images.getJSONObject(i).getString("name")));
        }
        return imageList;
    }

    public List<Image> getImageTag(String imageName){
        headers.set("Authorization", token);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                accountUrl+username+"/"+imageName+"/"+"tags",
                HttpMethod.GET, requestEntity, String.class);
        JSONObject jsonobject = JSONObject.parseObject(response.getBody());
        JSONArray images = jsonobject.getJSONArray("results");
        List<Image> imageList = new ArrayList<>();
        for(int i = 0; i < images.size();i++){
            Image image = new Image();
            image.setId(counter.incrementAndGet());
            image.setName(username+"/"+imageName + ":" + images.getJSONObject(i).getString("name"));
            image.setLastUpdated(images.getJSONObject(i).getString("last_updated"));
            imageList.add(image);
        }
        return imageList;
    }
}
