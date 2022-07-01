package com.example.starlingui.Dao;

import com.example.starlingui.model.StarlingProject;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StarlingProjectDao implements Dao<StarlingProject> {

    @Autowired
    private StarlingProjectRepository repo;

    @Override
    public void save(StarlingProject starlingProject) {
        repo.save(starlingProject);
    }

//    public StarlingProject save(String body) throws Exception {
//        StarlingProject project = new StarlingProject(body);
//        return repo.save(project);
////        return project;
//    }

    @Override
    public Optional<StarlingProject> getById(String id) {
        return repo.findById(id);
    }

    @Override
    public List<StarlingProject> findAll() {
        return repo.findAll();
    }

    @Override
    public void deleteAll() {
        repo.deleteAll();
    }

    public void deleteById(String id) {
        repo.deleteById(id);
    }
}
