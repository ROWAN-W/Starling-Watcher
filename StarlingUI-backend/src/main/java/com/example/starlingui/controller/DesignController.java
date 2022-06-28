package com.example.starlingui.controller;

import com.example.starlingui.model.Image;
import com.example.starlingui.model.Node;
import com.example.starlingui.model.User;
import com.example.starlingui.service.DockerHubServiceImpl;
import com.example.starlingui.service.NodeService;
import com.google.gson.Gson;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.JSON;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import javax.annotation.Resource;
import java.io.IOException;
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
     * @Description Get request (available nodes)
     * @return ResponseEntity<String>
     */

    @GetMapping("/available-nodes")
    public ResponseEntity<String> getAvailableNodes(){
        try{
            NodeService nodeService=new NodeService();
            List<Node> nodeList=nodeService.getNodeList();
            Gson gson = new Gson();
            String json = gson.toJson(nodeList);
            return ResponseEntity.ok(json);
        }
        catch (ApiException apiException){
            return ResponseEntity
                    .status(500)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body("Kubernetes API fail :"+apiException.getMessage());
        }
        catch (IOException ioException){
            return ResponseEntity
                    .status(500)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body("Kubernetes API fail :"+ioException.getMessage());
        }
    }





}
