package com.example.starlingui.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
