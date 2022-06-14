package designTab;

import com.alibaba.fastjson.JSONObject;
import model.Image;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import utils.DockerClient;

import java.util.List;


@RestController
@RequestMapping("/api")
public class designController {
    @GetMapping("/")
    private ResponseEntity<String> getRoot() {

        return ResponseEntity.ok("Hello Song");
    }
    @PostMapping(
            value = "/images", consumes = "application/json", produces = "application/json")
    public ResponseEntity<String> getImageList(@RequestBody JSONObject user) {
        try {
            DockerClient dockerClient = new DockerClient(user);
            List<Image> images = dockerClient.getImageList();
            JSONObject node = new JSONObject();
            node.put("results",images);
            return ResponseEntity.ok(node.toJSONString());
        } catch (HttpStatusCodeException e) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }


}
