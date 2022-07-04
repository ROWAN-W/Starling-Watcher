package com.example.starlingui.service;

import com.example.starlingui.Dao.StarlingUserDao;
import com.example.starlingui.model.StarlingUser;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class StarlingUserService implements StarlingService<StarlingUser> {

    @Autowired
    private StarlingUserDao userDao;

    @Override
    public String getAll() {
        List<StarlingUser> users = userDao.findAll();
        JSONArray ja = new JSONArray();
        for (StarlingUser user : users) {
            JSONObject jo = new JSONObject();
            jo.put("name", user.getName());
            jo.put("id", user.getId());
            ja.put(jo);
        }
        return ja.toString();
    }

    @Override
    public void initialize() {
        userDao.deleteAll();
        userDao.save(new StarlingUser("34567ihf87ft687guy6" , "John", "1234"));
        userDao.save(new StarlingUser("kjt67889hut7iof8iuu", "Alice", "1234"));
        userDao.save(new StarlingUser("40jf94jf93jjf40f3j0", "Bob", "5678"));
    }

    public String login(String body) throws Exception {
        Gson gson = new Gson();
        JsonObject bodyJson = gson.fromJson(body, JsonObject.class);
        String name = bodyJson.get("name").getAsString();
        String password = bodyJson.get("password").getAsString();
        StarlingUser user = userDao.findByName(name);
        if (user == null || !Objects.equals(user.getPassword(), password)) {
            throw new Exception("Invalid username or password!");
        }
        JSONObject jsonObject = new JSONObject(user);
        jsonObject.remove("password");
        return jsonObject.toString();
    }

    public String update(String body, String id) throws Exception {
        JSONObject bodyJson = new JSONObject(body);
        String oldPassword = bodyJson.get("oldPassword").toString();
        String password = bodyJson.get("password").toString();
        Optional<StarlingUser> optUser = userDao.getById(id);
        if (optUser.isEmpty()) {
            throw new Exception("User does not exist!")
        }
        StarlingUser userToUpdate = optUser.get();
        if (!Objects.equals(oldPassword, userToUpdate.getPassword())) {
            throw new Exception("Invalid old password!")
        }
        userToUpdate.setPassword(password);
        userDao.save(userToUpdate);
        JSONObject jsonObject = new JSONObject(userToUpdate);
        jsonObject.remove("password");
        return jsonObject.toString();
    }

    public String save(StarlingUser user) throws Exception {
        Gson gson = new Gson();
        String json = gson.toJson(user);
        userDao.save(user);
        JsonObject userJson = (JsonObject) gson.toJsonTree(user);
        userJson.remove("password");
        return gson.toJson(userJson);
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
