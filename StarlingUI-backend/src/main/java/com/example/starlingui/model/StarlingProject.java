package com.example.starlingui.model;

import com.google.gson.JsonObject;
import lombok.Data;
import org.bson.conversions.Bson;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "StarlingProjects")
@Data
public class StarlingProject {

    @Id
    private String id;

    private String name;
    private String dateModified;
    private String lastModifiedBy;
    private String saved;
    private String ownerID;
    private List<String> memberIDs;
    private List<ProjectConfig> config;
    private List<ProjectMapping> mapping;


    public StarlingProject() {
        super();
    }

    public StarlingProject(String name) {
        this.name = name;
    }

    public void setMemberIDs(JSONArray ja) throws Exception {
        memberIDs = new ArrayList<>();
        for (int i = 0; i < ja.length(); i++) {
            memberIDs.add(ja.get(i).toString());
        }
    }

    public void setConfig(JSONArray ja) {
        config = new ArrayList<>();
        for (int i = 0; i < ja.length(); i++) {
            config.add(ja.getJSONObject(i));
        }
    }
}
