package com.example.starlingui.controller;

import com.example.starlingui.Dao.StarlingProjectDao;
import com.example.starlingui.Dao.StarlingUserDao;
import com.example.starlingui.model.Image;
import com.example.starlingui.model.StarlingProject;
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

    @Autowired
    private StarlingProjectDao projectDao;

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
     * @Description Save a new user
     * @param user User to be added to the database, contains name and password
     * @return return User id and name, 403 if user already exists, return 200 if success
     */
    @PostMapping("/users")
    public ResponseEntity<String> saveUser(@RequestBody StarlingUser user) {
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
     * @Description Update the password of user
     * @param body Contains old password and new password
     * @param id id of the user to be updated
     * @return User id and username, Http Status is 403 if user to be updated doesn't exist, 200 if success
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@RequestBody String body, @PathVariable String id) {
        try {
            JSONObject bodyJson = new JSONObject(body);
//            Gson gson = new Gson();
//            JsonObject bodyJson = gson.fromJson(body, JsonObject.class);
            String oldPassword = bodyJson.get("oldPassword").toString();
            String password = bodyJson.get("password").toString();
            Optional<StarlingUser> optUser = userDao.getById(id);
            if (optUser.isEmpty()) {
                String errorJson = getErrorJson("User does not exist!");
                return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
            }
            StarlingUser userToUpdate = optUser.get();
            if (!Objects.equals(oldPassword, userToUpdate.getPassword())) {
                String errorJson = getErrorJson("Invalid old password!");
//                return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorJson);
            }
            userToUpdate.setPassword(password);
            userDao.save(userToUpdate);
//            JsonObject jsonObject = (JsonObject) gson.toJsonTree(userToUpdate);
            JSONObject jsonObject = new JSONObject(userToUpdate);
            jsonObject.remove("password");
//            String json = gson.toJson(jsonObject);
//            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
//            return ResponseEntity.status(HttpStatus.OK).body(jsonObject.toString());
            return ResponseEntity.ok(jsonObject.toString());
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
            JSONObject jsonObject = new JSONObject(user);
            jsonObject.remove("password");
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        } catch (Exception e) {
            String errorJson = getErrorJson("Invalid username or password!");
            return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
        }
    }

    /**
     * @Description Used for tests, get all users
     * @return information of all users
     */
    @GetMapping("/database")
    public ResponseEntity<String> showDatabase() {
        List<StarlingUser> users = userDao.findAll();
//        Gson gson = new Gson();
//        String json = gson.toJson(users);
        JSONArray ja = new JSONArray(users);
        return new ResponseEntity<>(ja.toString(), HttpStatus.OK);
    }

    /**
     * @Description Used for tests, delete all users and add three sample users
     * @return Initialize success message
     */
    @GetMapping("/initialize")
    public ResponseEntity<String> initializeDatabase() {
        userDao.deleteAll();
        projectDao.deleteAll();
        userDao.save(new StarlingUser("John", "1234"));
        userDao.save(new StarlingUser("Alice", "1234"));
        userDao.save(new StarlingUser("Bob", "5678"));
        return new ResponseEntity<>("Database has been initialized", HttpStatus.OK);
    }

    /**
     * @Description Get all projects in database
     * @return All projects informaion
     */
    @GetMapping("/projects")
    public ResponseEntity<String> getAllProjects() {
        List<StarlingProject> projects = projectDao.findAll();
        JSONArray ja = new JSONArray(projects);
        return new ResponseEntity<>(ja.toString(), HttpStatus.OK);
    }

    /**
     * @Description Add a new project to database
     * @param body Project data
     * @return id and 200
     */
    @PostMapping("/projects")
    public ResponseEntity<String> saveProject(@RequestBody String body) {
//        JSONObject bodyJson = new JSONObject(body);
//        projectDao.save(project);
//        return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        try {
            JSONObject jsonObject = new JSONObject(body);
            String name = jsonObject.get("name").toString();
            String dateModified = jsonObject.get("dateModified").toString();
            String lastModifiedBy = jsonObject.get("lastModifiedBy").toString();
            String saved = jsonObject.get("saved").toString();
            String ownerID = jsonObject.get("ownerID").toString();
            String memberIDs = jsonObject.get("memberIDs").toString();
            String config = jsonObject.get("config").toString();
            StarlingProject project = new StarlingProject(name);
            project.setDateModified(dateModified);
            project.setSaved(saved);
            project.setLastModifiedBy(lastModifiedBy);
            project.setOwnerID(ownerID);
            project.setMemberIDs(memberIDs);
            project.setConfig(config);
            projectDao.save(project);
            jsonObject = new JSONObject(project);
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        } catch (Exception e) {
            String errorJson = getErrorJson("Invalid request body!");
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
        Optional<StarlingProject> optProject = projectDao.getById(id);
        if (optProject.isEmpty()) {
            String errorJson = getErrorJson("Project id does not exist!");
            return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
        }
        StarlingProject project = optProject.get();
        project.setJson(body);
        projectDao.save(project);
        JSONObject jsonObject = new JSONObject(project);
        return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
    }

    /**
     * @Description Delete a project
     * @param id id of project to be deleted
     * @return 403 if id does not match, id and 200 if success
     */
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable String id) {
        Optional<StarlingProject> optProject = projectDao.getById(id);
        if (optProject.isEmpty()) {
            String errorJson = getErrorJson("Project id does not exist!");
            return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
        }
        StarlingProject project = optProject.get();
        projectDao.deleteById(id);
        JSONObject jsonObject = new JSONObject(project);
        return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
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
