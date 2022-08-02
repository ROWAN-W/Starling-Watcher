package com.example.starlingui.controller;

import com.example.starlingui.exceptions.StarlingException;
import com.example.starlingui.model.Design;
import com.example.starlingui.model.Image;
import com.example.starlingui.model.domainNode;
import com.example.starlingui.model.User;
import com.example.starlingui.service.DockerHubServiceImpl;
import com.example.starlingui.service.designNodeServiceImpl;
import com.example.starlingui.service.TemplatingServiceImp;
import com.example.starlingui.service.uploadYAMLServiceImpl;
import com.google.gson.Gson;
import io.kubernetes.client.openapi.ApiException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.example.starlingui.Dao.StarlingProjectDao;
import com.example.starlingui.Dao.StarlingUserDao;
import com.example.starlingui.model.StarlingProject;
import com.example.starlingui.model.StarlingUser;
import com.google.gson.JsonObject;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;


import javax.annotation.Resource;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Part;
import java.io.*;
import java.util.ArrayList;
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


    // function to delete subdirectories and files
    private void deleteDirectory(File file)
    {
        // store all the paths of files and folders present
        // inside directory
        for (File subfile : file.listFiles()) {

            // recursively call function to empty subfolder
            if (subfile.isDirectory()) {
                deleteDirectory(subfile);
            }

            // delete files and empty subfolders
            subfile.delete();
        }
    }


    /**
     * @Description upload and deploy Yaml file
     * @param file (MultipartFile)
     * @return ResponseEntity<String>
     */

    @PostMapping("/upload")
    public ResponseEntity<String> uploadYAML (@RequestParam("file") MultipartFile file, @RequestParam("namespace") String namespace) {

        File temDir=new File("temdir");
        //clear temdir at start
        deleteDirectory(temDir);
        temDir.mkdir();
        uploadYAMLServiceImpl upload =new uploadYAMLServiceImpl();
        File parts=new File("temdir"+File.separator+"Parts");
        parts.mkdir();

        try{
           upload.processYAML(file,namespace);
        }catch (StarlingException starlingException){
            return ResponseEntity
                    .status(404)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body(starlingException.getMessage());
        }

        return ResponseEntity.ok("deployed");
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





     /** @Description Save a new user
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
            String errorJson = getErrorJson("Duplicate user name!");
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
        userDao.save(new StarlingUser("34567ihf87ft687guy6" , "John", "1234"));
        userDao.save(new StarlingUser("kjt67889hut7iof8iuu", "Alice", "1234"));
        userDao.save(new StarlingUser("40jf94jf93jjf40f3j0", "Bob", "5678"));
        return new ResponseEntity<>("Database has been initialized", HttpStatus.OK);
    }

    /**
     * @Description Get all projects in database
     * @return All projects informaion
     */
    @GetMapping("/projects")
    public ResponseEntity<String> getAllProjects() {
        List<StarlingProject> projects = projectDao.findAll();
        JSONArray ja = new JSONArray();
        for (StarlingProject project : projects) {
            JSONObject jsonObject = new JSONObject(project.getJson());
            jsonObject.put("id", project.getId());
            ja.put(jsonObject);
        }
        return new ResponseEntity<>(ja.toString(), HttpStatus.OK);
    }

    /**
     * @Description Add a new project to database
     * @param body Project data
     * @return id and 200
     */
    @PostMapping("/projects")
    public ResponseEntity<String> saveProject(@RequestBody String body) {
        try {
            StarlingProject project = new StarlingProject(body);
            projectDao.save(project);
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id", project.getId());
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
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
        Optional<StarlingProject> optProject = projectDao.getById(id);
        if (optProject.isEmpty()) {
            String errorJson = getErrorJson("Project id does not exist!");
            return new ResponseEntity<>(errorJson, HttpStatus.FORBIDDEN);
        }
        StarlingProject project = optProject.get();
        project.setJson(body);
        projectDao.save(project);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", id);
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
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", id);
        return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
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
