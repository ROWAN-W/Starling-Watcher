package com.example.starlingui.service;

import com.example.starlingui.Dao.StarlingProjectDao;
import com.example.starlingui.model.StarlingProject;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StarlingProjectServiceImpl implements StarlingService<StarlingProject> {

    @Autowired
    private StarlingProjectDao projectDao;

    @Override
    public String getAll() {
        List<StarlingProject> projects = projectDao.findAll();
        JSONArray ja = new JSONArray();
        for (StarlingProject project : projects) {
            JSONObject jsonObject = new JSONObject(project.getJson());
            jsonObject.put("id", project.getId());
            ja.put(jsonObject);
        }
        return ja.toString();
    }

    @Override
    public void initialize() {
        projectDao.deleteAll();
    }

    public String save(String body) throws Exception {
        if (!validProjectBody(body)) {
            throw new Exception("Invalid Project Style!");
        }
        StarlingProject project = new StarlingProject(body);
        projectDao.save(project);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", project.getId());
        return jsonObject.toString();
    }

    public String update(String body, String id) throws Exception {
        if (!validProjectBody(body)) {
            throw new Exception("Invalid Project Style!");
        }
        Optional<StarlingProject> optProject = projectDao.getById(id);
        if (optProject.isEmpty()) {
            throw new Exception("Project id does not exist!");
        }
        StarlingProject project = optProject.get();
        project.setJson(body);
        projectDao.save(project);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", id);
        return jsonObject.toString();
    }

    public String delete(String id) throws Exception {
        Optional<StarlingProject> optProject = projectDao.getById(id);
        if (optProject.isEmpty()) {
            throw new Exception("Project id does not exist!");
        }
        StarlingProject project = optProject.get();
        projectDao.deleteById(id);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", id);
        return jsonObject.toString();
    }

    /**
     * @Description check if project data is valid
     * @param body project data to be stored
     * @return true if data structure is valid, else false
     */
    private boolean validProjectBody(String body) throws Exception {
        JSONObject projectJson = new JSONObject(body);
        //first layer key check
        if (!(projectJson.has("name") && projectJson.has("dateModified") &&
                projectJson.has("lastModifiedBy") && projectJson.has("saved") &&
                projectJson.has("ownerID") && projectJson.has("memberIDs") &&
                projectJson.has("config") && projectJson.has("mapping"))) {
            return false;
        }
        //check config structure
        JSONArray configArray = projectJson.getJSONArray("config");
        for (int i = 0; i < configArray.length(); i++) {
            JSONObject jsonObject = configArray.getJSONObject(i);
            if (!validConfigJson(jsonObject)) {
                return false;
            }
        }
        //check mapping structure
        JSONArray mappingArray = projectJson.getJSONArray("mapping");
        for (int i = 0; i < mappingArray.length(); i++) {
            JSONObject jsonObject = mappingArray.getJSONObject(i);
            if (!validMappingJson(jsonObject)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @Description check if one mapping json in the mapping array is valid
     * @param jsonObject one mapping json in mapping array
     * @return true if structure is valid, else false
     */
    private boolean validMappingJson(JSONObject jsonObject) {
        return jsonObject.has("nodeID") && jsonObject.has("mappedDrones");
    }

    /**
     * @Description check if one config json in the config array is valid
     * @param jsonObject one config json in config array
     * @return true if structure is valid, else false
     */
    private boolean validConfigJson(JSONObject jsonObject) {
        if (!(jsonObject.has("id") && jsonObject.has("name") && jsonObject.has("kind") &&
                jsonObject.has("label") && jsonObject.has("containers"))) {
            return false;
        }
        //check label structure
        JSONObject labelJson = jsonObject.getJSONObject("label");
        if (!(labelJson.has("app") && labelJson.has("platform"))) {
            return false;
        }
        //check container structure
        JSONArray containers = jsonObject.getJSONArray("containers");
        for (int i = 0; i < containers.length(); i++) {
            if (!validContainerJson(containers.getJSONObject(i))) {
                return false;
            }
        }
        return true;
    }

    /**
     * @Description check if one container in the containers array is valid
     * @param jsonObject one container json in containers array
     * @return true if structure is valid, else false
     */
    private boolean validContainerJson(JSONObject jsonObject) {
        return jsonObject.has("id") && jsonObject.has("name") && jsonObject.has("command") &&
                jsonObject.has("args") && jsonObject.has("env") && jsonObject.has("port");
    }
}
