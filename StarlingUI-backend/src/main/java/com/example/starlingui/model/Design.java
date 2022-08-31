package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Data

public class Design {

    private String name;
    private List<Configuration> config;
    private List<Mapping> mapping;


    public void setName(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }

    public void setConfig(List<Configuration> config) {
        this.config = config;
    }
    public List<Configuration> getConfig() {
        return config;
    }

    public void setMapping(List<Mapping> mapping) {
        this.mapping = mapping;
    }
    public List<Mapping> getMapping() {
        return mapping;
    }
}
