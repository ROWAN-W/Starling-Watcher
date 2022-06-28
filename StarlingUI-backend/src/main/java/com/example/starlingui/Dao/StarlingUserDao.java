package com.example.starlingui.Dao;

import com.example.starlingui.model.StarlingUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StarlingUserDao implements Dao<StarlingUser>{

    @Autowired
    private StarlingUserRepository repo;

    @Override
    public void save(StarlingUser user) {
        repo.save(user);
    }

    @Override
    public Optional<StarlingUser> getById(String id) {
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

    public StarlingUser findByName(String name) {
        return repo.findByName(name);
    }

    public List<StarlingUser> findAll() {
        return repo.findAll();
    }

    public void deleteAll() {
        repo.deleteAll();
    }
}
