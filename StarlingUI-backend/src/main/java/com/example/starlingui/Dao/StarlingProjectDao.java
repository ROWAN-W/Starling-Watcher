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

    public StarlingProject save(String body) throws Exception {
        JSONObject jsonObject = new JSONObject(body);
        String name = jsonObject.get("name").toString();
//        String dateModified = jsonObject.get("dateModified").toString();
//        String lastModifiedBy = jsonObject.get("lastModifiedBy").toString();
//        String saved = jsonObject.get("saved").toString();
//        String ownerID = jsonObject.get("ownerID").toString();
        JSONArray memberIDs = jsonObject.getJSONArray("memberIDs");
        JSONArray config = jsonObject.getJSONArray("config");
        StarlingProject project = new StarlingProject(name);
//        project.setDateModified(dateModified);
//        project.setSaved(saved);
//        project.setLastModifiedBy(lastModifiedBy);
//        project.setOwnerID(ownerID);
        project.setMemberIDs(memberIDs);
        project.setConfig(config);
        return repo.save(project);
//        return project;
    }

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
