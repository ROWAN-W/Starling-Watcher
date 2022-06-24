package com.example.starlingui.Dao;

import com.example.starlingui.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserDao implements Dao<User>{

    @Autowired
    private UserRepository repo;

    @Override
    public void save(User user) {
        repo.save(user);
    }

    @Override
    public Optional<User> getById(String id) {
        return repo.findById(id);
    }

//    @Override
//    public void update(User user) {
//
//    }

//    @Override
//    public void deleteById(String id) {
//        repo.deleteById(id);
//    }

    public User findByName(String name) {
        return repo.findByName(name);
    }

    public List<User> findAll() {
        return repo.findAll();
    }
}
