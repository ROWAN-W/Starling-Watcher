package com.example.starlingui.controller;

import com.example.starlingui.Dao.StarlingUserDao;
import com.example.starlingui.model.Image;
import com.example.starlingui.model.StarlingUser;
import com.example.starlingui.model.User;
import com.example.starlingui.service.DockerHubServiceImpl;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import javax.annotation.Resource;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/design")
public class DesignController {

    @Resource
    private DockerHubServiceImpl dockerHubService;

    @Autowired
    private StarlingUserDao userDao;

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
     * @Description Add a new user
     * @param user User to be added to the database
     * @return return User id and username 403 if user already exists, return 200 if success
     */
    @PostMapping("/users")
    public ResponseEntity<String> newUser(@RequestBody StarlingUser user) {
        Gson gson = new Gson();
        String json = gson.toJson(user);
        String id = user.getId();
        String name = user.getName();
        Optional<StarlingUser> optUser = userDao.getById(id);
        StarlingUser oldUser = userDao.findByName(name);
        if (optUser.isPresent() || oldUser != null) {
            return new ResponseEntity<>("User already exists!", HttpStatus.FORBIDDEN);
        }
        userDao.save(user);
        JsonObject userJson = (JsonObject) gson.toJsonTree(user);
        userJson.remove("password");
        String jsonString = gson.toJson(userJson);
        return new ResponseEntity<>(jsonString, HttpStatus.OK);
    }

    /**
     * @Description Modify the information of user
     * @param user new user
     * @param id id of the user to be updated
     * @return User id and username, Http Status is 403 if user to be updated doesn't exist, 200 if success
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<String> replaceUser(@RequestBody StarlingUser user, @PathVariable String id) {
        Optional<StarlingUser> optUser = userDao.getById(id);
        if (optUser.isEmpty()) {
            return new ResponseEntity<>("User does not exist!", HttpStatus.FORBIDDEN);
        }
        StarlingUser userToUpdate = optUser.get();
        userToUpdate.setName(user.getName());
        userToUpdate.setPassword(user.getPassword());
        userDao.save(userToUpdate);
        Gson gson = new Gson();
        JsonObject userJson = (JsonObject) gson.toJsonTree(userToUpdate);
        userJson.remove("password");
        String jsonString = gson.toJson(userJson);
        return new ResponseEntity<>(jsonString, HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<String> allUsers() {
        List<StarlingUser> users = userDao.findAll();
        Gson gson = new Gson();
        String json = gson.toJson(users);
        return new ResponseEntity<>(json, HttpStatus.OK);
    }

    /**
     * @Description Used for tests, delete all users and add three sample users
     * @return Initialize success message
     */
    @GetMapping("/initialize")
    public ResponseEntity<String> initializeDatabase() {
        userDao.deleteAll();
        userDao.save(new StarlingUser("John", "1234"));
        userDao.save(new StarlingUser("Alice", "1234"));
        userDao.save(new StarlingUser("Bob", "5678"));
        return new ResponseEntity<>("Database has been initialized", HttpStatus.OK);
    }
}
