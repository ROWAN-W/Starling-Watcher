package com.example.starlingui.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.starlingui.model.Image;
import com.example.starlingui.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class DockerHubServiceImpl implements ImageService{

    @Autowired
    private RestTemplate restTemplate;

    private final AtomicLong counter = new AtomicLong();

    private final String accountUrl = "https://registry.hub.docker.com/v2/repositories/";

    private String token = null;

    private String username = null;


    /**
     * @Description (get token from dockerhub,set current user)
     * @param user dockerhub user information(username,password)
     */
    @Override
    public void setToken(User user) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body= JSON.toJSONString(user);
        HttpEntity<String> request = new HttpEntity<>(body, headers);

        String loginUrl = "https://hub.docker.com/v2/users/login";
        ResponseEntity<String> result = restTemplate.postForEntity(loginUrl, request, String.class);
        JSONObject token = JSONObject.parseObject(result.getBody());

        this.token = "Bearer " + token.getString("token");
        this.username = user.getUsername();
    }

    /**
     * @Description  Send Get request(with token) to docker hub ,get registry content of user
     * @return return images list of user account
     */
    @Override
    public List<Image> getImageList() {
        String url = accountUrl+username;
        JSONArray images = getRequest(url);
        List<Image> imageList = new ArrayList<>();
        for(int i = 0; i < images.size();i++){
            imageList.addAll(getImageTag(images.getJSONObject(i).getString("name")));
        }
        return imageList;
    }

    /**
     * @Description Send Get request(with token) to docker hub ,get all tags of image
     * @param imageName image name
     * @return return images list with tag
     */
    public List<Image> getImageTag(String imageName){
        String url = accountUrl+username+"/"+imageName+"/"+"tags";
        JSONArray images = getRequest(url);
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

    /**
     * @Description Get request(with token)
     * @param url path of request
     * @return return json of response body
     */
    public JSONArray getRequest(String url){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, requestEntity, String.class);
        JSONObject jsonobject = JSONObject.parseObject(response.getBody());
        return jsonobject.getJSONArray("results");
    }

}
