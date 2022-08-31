package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;


@Component
@Data
public class SaveProject {
    private String json;

    public void setJson(String json){this.json = json;}

    public String getJson() {
        return json;
    }
}