package com.example.starlingui.model;


import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Data
public class Pod {
    private String podName;
    private String namespace;

    private List<Container> containers;

    public List<Container> getContainers() {
        return containers;
    }

    public String getNamespace() {
        return namespace;
    }

    public String getPodName() {
        return podName;
    }

    public void setContainers(List<Container> containers) {
        this.containers = containers;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public void setPodName(String podName) {
        this.podName = podName;
    }

}
