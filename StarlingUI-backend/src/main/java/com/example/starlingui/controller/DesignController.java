package com.example.starlingui.controller;

import com.example.starlingui.model.Design;
import com.example.starlingui.model.Image;
import com.example.starlingui.model.User;
import com.example.starlingui.service.DockerHubServiceImpl;
import com.example.starlingui.service.TemplatingServiceImp;
import com.google.gson.Gson;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import javax.annotation.Resource;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/design")
public class DesignController {

    @Resource
    private DockerHubServiceImpl dockerHubService;

    /**
     * @Description Post request(with Body param)
     * @param user DockerHub User information(username,password)
     * @return return json of response body
     */
    @PostMapping("/images")
    public ResponseEntity<String> getImageList(@RequestBody User user) {
        try {
            dockerHubService.setToken(user);
            List<Image> images = dockerHubService.getImageList();
            Gson gson = new Gson();
            String json = gson.toJson(images);
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * @Description Post request(with Body param)
     * @param designs Pod designs from user (name,config,mapping)
     * @return return ResponseEntity<String>
     */
    @PostMapping("/templating")
    public ResponseEntity<String> doTemplatingAndDeploy(@RequestBody Design designs) {
        try {
            TemplatingServiceImp templating = new TemplatingServiceImp();
            String message = templating.doTemplating(designs);
            return ResponseEntity.ok(message);
        }catch(Exception e){
            return ResponseEntity
                    .status(400)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body("Deploy fail :"+ e.getMessage());
        }
    }

}
