package com.example.starlingui.WebController;

import com.alibaba.fastjson.JSONObject;
import com.example.starlingui.model.Image;
import com.example.starlingui.model.User;
import com.example.starlingui.service.DockerHubServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/design")
public class designController {

    @Autowired
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
            JSONObject node = new JSONObject();
            node.put("results",images);
            return ResponseEntity.ok(node.toJSONString());
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }


}
