package com.example.starlingui.service;

import com.example.starlingui.model.Image;
import com.example.starlingui.model.User;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class DockerHubServiceImpl implements ImageService{

    @Resource
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
        String body= new Gson().toJson(user);
        HttpEntity<String> request = new HttpEntity<>(body, headers);

        String loginUrl = "https://hub.docker.com/v2/users/login";
        ResponseEntity<String> result = restTemplate.postForEntity(loginUrl, request, String.class);
        JsonObject token = new Gson().fromJson(result.getBody(), JsonObject.class);


        this.token = "Bearer " + token.get("token").getAsString();
        this.username = user.getUsername();
    }

    /**
     * @Description  Send Get request(with token) to docker hub ,get registry content of user
     * @return return images list of user account
     */
    @Override
    public List<Image> getImageList() {
        String url = accountUrl+username;
        JsonArray images = getRequest(url);
        List<Image> imageList = new ArrayList<>();
        for(int i = 0; i < images.size();i++){
            imageList.addAll(getImageTag(images.get(i).getAsJsonObject().get("name").getAsString()));
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
        JsonArray images = getRequest(url);
        List<Image> imageList = new ArrayList<>();
        for(int i = 0; i < images.size();i++){
            Image image = new Image();
            image.setId(counter.incrementAndGet());
            image.setName(username+"/"+imageName + ":" + images.get(i).getAsJsonObject().get("name").getAsString());
            image.setLastUpdated(images.get(i).getAsJsonObject().get("last_updated").getAsString());
            imageList.add(image);
        }
        return imageList;
    }

    /**
     * @Description Get request(with token)
     * @param url path of request
     * @return return json of response body
     */
    public JsonArray getRequest(String url){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, requestEntity, String.class);
        JsonObject jsonObject = new Gson().fromJson(response.getBody(), JsonObject.class);
        return jsonObject.getAsJsonArray("results");
    }

}
