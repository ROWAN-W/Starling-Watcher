package com.example.starlingui.model;

import java.util.HashMap;
import java.util.List;
public class Configuration {

    private String id;
    private String name;
    private String kind;
    private HashMap<String, String> label;
    private List<Containers> containers;
    public void setId(String id) {
        this.id = id;
    }
    public String getId() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }
    public String getKind() {
        return kind;
    }

    public void setLabel(HashMap<String, String> label) {
        this.label = label;
    }
    public HashMap<String, String> getLabel() {
        return label;
    }

    public void setContainers(List<Containers> containers) {
        this.containers = containers;
    }
    public List<Containers> getContainers() {
        return containers;
    }

}
