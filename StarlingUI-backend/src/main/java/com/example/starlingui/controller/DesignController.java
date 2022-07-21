package com.example.starlingui.controller;

import com.example.starlingui.model.Design;
import com.example.starlingui.model.Image;
import com.example.starlingui.model.domainNode;
import com.example.starlingui.model.User;
import com.example.starlingui.service.*;
import com.google.gson.Gson;
import io.kubernetes.client.openapi.ApiException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.example.starlingui.model.StarlingUser;
import org.json.JSONObject;


import javax.annotation.Resource;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/design")
public class DesignController {

    @Resource
    private DockerHubServiceImpl dockerHubService;


    @Resource
    private StarlingUserServiceImpl userService;

    @Resource
    private StarlingProjectService projectService;

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

    @GetMapping("/nodes")
    public ResponseEntity<String> getAvailableNodes() {
        try {
            designNodeServiceImpl designNodeServiceImpl = new designNodeServiceImpl();
            List<domainNode> domainNodeList = designNodeServiceImpl.getNodeList();
            Gson gson = new Gson();
            String json = gson.toJson(domainNodeList);
            return ResponseEntity.ok(json);
        } catch (ApiException apiException) {
            return ResponseEntity
                    .status(404)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body("Kubernetes API fail :" + apiException.getMessage());
        } catch (IOException ioException) {
            return ResponseEntity
                    .status(404)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body("Kubernetes API fail :" + ioException.getMessage());
        }
    }

    /** @Description Post request(with Body param)
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

    /**
     * @Description Update the password of user
     * @param body Contains old password and new password
     * @param id id of the user to be updated
     * @return User id and username, Http Status is 403 if user to be updated doesn't exist, 200 if success
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@RequestBody String body, @PathVariable String id) {
        try {
            return ResponseEntity.ok(userService.update(body, id));
        } catch (Exception e) {
            String errorJson = getErrorJson(e.getMessage());
            return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
        }

    }

    /**
     * @Description Get user information
     * @return Information of id and name of all users
     */
    @GetMapping("/users")
    public ResponseEntity<String> allUsers() {
        return new ResponseEntity<>(userService.getAll(), HttpStatus.OK);
    }

    /**
     * @Description Used for tests, get all users
     * @return information of all users
     */
    @GetMapping("/database")
    public ResponseEntity<String> showDatabase() {
        return new ResponseEntity<>(userService.showAll(), HttpStatus.OK);
    }

    /**
     * @Description Used for tests, delete all users and add three sample users
     * @return Initialize success message
     */
    @GetMapping("/initialize")
    public ResponseEntity<String> initializeDatabase() {
        userService.initialize();
        projectService.initialize();
        return new ResponseEntity<>("Database has been initialized", HttpStatus.OK);
    }

    /**
     * @Description Get all projects in database
     * @return All projects informaion
     */
    @GetMapping("/projects")
    public ResponseEntity<String> getAllProjects() {
        return new ResponseEntity<>(projectService.getAll(), HttpStatus.OK);
    }

    /**
     * @Description Add a new project to database
     * @param body Project data
     * @return id and 200
     */
    @PostMapping("/projects")
    public ResponseEntity<String> saveProject(@RequestBody String body) {
        try {
            return new ResponseEntity<>(projectService.save(body), HttpStatus.OK);
        } catch (Exception e) {
            String errorJson = getErrorJson(e.getMessage());
            return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
        }
    }

    /**
     * @Description Update a project
     * @param body New project data
     * @param id id of project to be updated
     * @return 403 if id does not match, 200 and id if success
     */
    @PutMapping("/projects/{id}")
    public ResponseEntity<String> updateProject(@RequestBody String body, @PathVariable String id) {
        try {
            return new ResponseEntity<>(projectService.update(body, id), HttpStatus.OK);
        } catch (Exception e) {
            String errorJson = getErrorJson(e.getMessage());
            return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
        }
    }

    /**
     * @Description Delete a project
     * @param id id of project to be deleted
     * @return 403 if id does not match, id and 200 if success
     */
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable String id) {
        try {
            return new ResponseEntity<>(projectService.delete(id), HttpStatus.OK);
        } catch (Exception e) {
            String errorJson = getErrorJson(e.getMessage());
            return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
        }
    }

    /**
     * @Description accept error message and make it json style
     * @param message error message
     * @return error message in json style
     */
    private String getErrorJson(String message) {
        return new JSONObject().put("errorMsg", message).toString();
    }
}
