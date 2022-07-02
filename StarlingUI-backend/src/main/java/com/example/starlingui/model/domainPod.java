package com.example.starlingui.model;


import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Data
public class domainPod {
    private String id;
    private String podName;
    private String namespace;

    private List<domainContainer> containers;

    public List<domainContainer> getContainers() {
        return containers;
    }


    public void setContainers(List<domainContainer> domainContainers) {
        this.containers = domainContainers;
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
