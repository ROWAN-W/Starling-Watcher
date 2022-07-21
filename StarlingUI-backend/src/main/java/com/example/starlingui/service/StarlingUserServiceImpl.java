package com.example.starlingui.service;

import com.example.starlingui.Dao.StarlingUserDao;
import com.example.starlingui.model.Role;
import com.example.starlingui.model.StarlingUser;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StarlingUserServiceImpl implements StarlingService<StarlingUser>, UserDetailsService {

    @Autowired
    private StarlingUserDao userDao;
    @Autowired
    private PasswordEncoder passwordEncoder;

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
        try {
            save(new StarlingUser("34567ihf87ft687guy6", "John", "1234"));
            save(new StarlingUser("kjt67889hut7iof8iuu", "Alice", "1234"));
            save(new StarlingUser("40jf94jf93jjf40f3j0", "Bob", "5678"));
        } catch (Exception ignored) {
        }
    }

    public String update(String body, String id) throws Exception {
        JSONObject bodyJson = new JSONObject(body);
        String oldPassword = bodyJson.get("oldPassword").toString();
        String password = bodyJson.get("password").toString();
        Optional<StarlingUser> optUser = userDao.getById(id);
        if (optUser.isEmpty()) {
            throw new Exception("User does not exist!");
        }
        StarlingUser userToUpdate = optUser.get();
        if (!passwordEncoder.matches(oldPassword, userToUpdate.getPassword())) {
            throw new Exception("Invalid old password!");
        }
        userToUpdate.setPassword(password);
        save(userToUpdate);
        JSONObject jsonObject = new JSONObject(userToUpdate);
        jsonObject.remove("password");
        jsonObject.remove("roles");
        return jsonObject.toString();
    }

    public void save(StarlingUser user) throws DuplicateKeyException {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.getRoles().add(new Role("ROLE_USER"));
        userDao.save(user);
    }

    public String showAll() {
        List<StarlingUser> users = userDao.findAll();
        JSONArray ja = new JSONArray(users);
        return ja.toString();
    }

    /**
     * @Description implement UserDetailService method, authorities not set
     * @param username name of user
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        StarlingUser user = getUserByName(username);
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        Collection<Role> roles = user.getRoles();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }
        return new User(user.getName(), user.getPassword(), authorities);
    }

    public StarlingUser getUserByName(String name) throws UsernameNotFoundException {
        StarlingUser user = userDao.findByName(name);
        if (user == null) {
            throw new UsernameNotFoundException("User name not found in the database!");
        }
        return user;
    }
}
