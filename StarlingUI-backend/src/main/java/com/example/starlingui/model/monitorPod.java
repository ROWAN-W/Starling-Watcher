package com.example.starlingui.model;


import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Data
public class monitorPod {
    private String id;
    private String podName;
    private String namespace;

    private List<monitorContainer> containers;

    public List<monitorContainer> getContainers() {
        return containers;
    }


    public void setContainers(List<monitorContainer> Containers) {
        this.containers =Containers;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public void setPodName(String podName) {
        this.podName = podName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
