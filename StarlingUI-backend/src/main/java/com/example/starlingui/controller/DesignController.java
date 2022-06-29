package com.example.starlingui.controller;

import com.example.starlingui.Dao.StarlingUserDao;
import com.example.starlingui.model.Image;
import com.example.starlingui.model.StarlingUser;
import com.example.starlingui.model.User;
import com.example.starlingui.service.DockerHubServiceImpl;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import javax.annotation.Resource;
import java.util.List;
import java.util.Objects;
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
     * @param user User to be added to the database, contains name and password
     * @return return User id and name, 403 if user already exists, return 200 if success
     */
    @PostMapping("/users")
    public ResponseEntity<String> newUser(@RequestBody StarlingUser user) {
        Gson gson = new Gson();
        String json = gson.toJson(user);
//        String name = user.getName();
//        if (starlingUserNameExists(name)) {
//            return new ResponseEntity<>("User already exists!", HttpStatus.FORBIDDEN);
//        }
        try {
            userDao.save(user);
        } catch (Exception e) {
            String errorJson = getErrorJson("Duplicated user name!");
            return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
        }
        JsonObject userJson = (JsonObject) gson.toJsonTree(user);
        userJson.remove("password");
        String jsonString = gson.toJson(userJson);
        return new ResponseEntity<>(jsonString, HttpStatus.OK);
    }

    /**
     * @Description Modify the information of user
     * @param body Contains old password and new password
     * @param id id of the user to be updated
     * @return User id and username, Http Status is 403 if user to be updated doesn't exist, 200 if success
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<String> replaceUser(@RequestBody String body, @PathVariable String id) {
        try {
            Gson gson = new Gson();
            JsonObject bodyJson = gson.fromJson(body, JsonObject.class);
            String oldPassword = bodyJson.get("oldPassword").getAsString();
            String password = bodyJson.get("password").getAsString();
            Optional<StarlingUser> optUser = userDao.getById(id);
            if (optUser.isEmpty()) {
                String errorJson = getErrorJson("User does not exist!");
                return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
            }
            StarlingUser userToUpdate = optUser.get();
            if (!Objects.equals(oldPassword, userToUpdate.getPassword())) {
                String errorJson = getErrorJson("Invalid old password!");
                return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
            }
            userToUpdate.setPassword(password);
            userDao.save(userToUpdate);
            JsonObject jsonObject = (JsonObject) gson.toJsonTree(userToUpdate);
            jsonObject.remove("password");
            String json = gson.toJson(jsonObject);
            return new ResponseEntity<>(json, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid Request body!", HttpStatus.FORBIDDEN);
        }

    }

    /**
     * @Description Get user information
     * @return Information of id and name of all users
     */
    @GetMapping("/users")
    public ResponseEntity<String> allUsers() {
        List<StarlingUser> users = userDao.findAll();
        JSONArray ja = new JSONArray();
        for (StarlingUser user : users) {
            JSONObject jo = new JSONObject();
            jo.put("name", user.getName());
            jo.put("id", user.getId());
            ja.put(jo);
        }
        String json = ja.toString();
        return new ResponseEntity<>(json, HttpStatus.OK);
    }

    /**
     * @Description User login process
     * @param body User input name and password
     * @return 200 if user name exists and password correct; else 403
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody String body) {
        try {
            Gson gson = new Gson();
            JsonObject bodyJson = gson.fromJson(body, JsonObject.class);
            String name = bodyJson.get("name").getAsString();
            String password = bodyJson.get("password").getAsString();
            StarlingUser user = userDao.findByName(name);
            if (user == null || !Objects.equals(user.getPassword(), password)) {
                String errorJson = getErrorJson("Invalid username or password!");
                return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
            }
            return new ResponseEntity<>(body, HttpStatus.OK);
        } catch (Exception e) {
            String errorJson = getErrorJson("Invalid username or password!");
            return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
        }
    }

    /**
     * @Description Used for tests
     * @return information of all users
     */
    @GetMapping("/database")
    public ResponseEntity<String> showDatabase() {
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

    private boolean starlingUserNameExists(String name) {
        StarlingUser user = userDao.findByName(name);
        return user != null;
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
