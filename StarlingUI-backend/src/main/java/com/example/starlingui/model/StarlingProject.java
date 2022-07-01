package com.example.starlingui.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private String memberIDs;
    private String config;


    public StarlingProject() {
        super();
    }

    public StarlingProject(String name) {
        this.name = name;
    }

    public void setJson(String json) {
        this.name = json;
    }
}
