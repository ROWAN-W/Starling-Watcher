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
    private String json;

    public StarlingProject() {
        super();
    }

    public StarlingProject(String json) {
        this.json = json;
    }

}
