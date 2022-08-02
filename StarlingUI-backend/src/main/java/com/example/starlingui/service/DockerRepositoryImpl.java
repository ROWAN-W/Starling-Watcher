package com.example.starlingui.service;

import com.example.starlingui.model.Image;
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
public class DockerRepositoryImpl implements ImageService{

    private final AtomicLong counter = new AtomicLong();

    private final String repositoryUrl = "https://hub.docker.com/v2/repositories";

    private String repository = null;
    @Resource
    private RestTemplate restTemplate;

    @Override
    public List<Image> getImageList(String repository){
        this.repository = repository;
        String limitation = "/?page_size=100";
        String url = repositoryUrl + "/" + repository + limitation;
        JsonArray result = getRequest(url);
        if (result.isEmpty()){
            return null;
        }
        List<Image> imageList = new ArrayList<>();
        for(int i = 0; i < result.size();i++){
            imageList.addAll(getImageTag(result.get(i).getAsJsonObject().get("name").getAsString()));
        }
        return imageList;


    }

    @Override
    public List<Image> getImageTag(String imageName){
        String url = repositoryUrl+repository+"/"+imageName+"/"+"tags";
        JsonArray images = getRequest(url);
        if(images.isEmpty()){
            return null;
        }
        List<Image> imageList = new ArrayList<>();
        for(int i = 0; i < images.size();i++){
            Image image = new Image();
            image.setId(counter.incrementAndGet());
            image.setName(repository+"/"+imageName + ":" + images.get(i).getAsJsonObject().get("name").getAsString());
            image.setLastUpdated(images.get(i).getAsJsonObject().get("last_updated").getAsString());
            imageList.add(image);
        }
        return imageList;
    }

    public JsonArray getRequest(String url){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, requestEntity, String.class);
        JsonObject jsonObject = new Gson().fromJson(response.getBody(), JsonObject.class);
        if(response.getStatusCodeValue()!=200){
            return null;
        }
        return jsonObject.getAsJsonArray("results");
    }
}
