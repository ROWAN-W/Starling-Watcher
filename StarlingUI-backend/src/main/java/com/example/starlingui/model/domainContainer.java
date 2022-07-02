package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class domainContainer {
    private String id;
    private String containerName;
    private String containerID;

    // possible states: waiting, running, terminated
    private  String containerState;



    public void setContainerName(String containerName) {
        this.containerName = containerName;
    }

    public void setContainerState(String containerState) {
        this.containerState = containerState;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
}
