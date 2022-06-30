package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class Container {
    private String containerName;
    private String containerID;

    // possible states: waiting, running, terminated
    private  String containerState;

    public String getContainerID() {
        return containerID;
    }

    public String getContainerName() {
        return containerName;
    }

    public void setContainerID(String containerID) {
        this.containerID = containerID;
    }

    public String getContainerState() {
        return containerState;
    }

    public void setContainerName(String containerName) {
        this.containerName = containerName;
    }

    public void setContainerState(String containerState) {
        this.containerState = containerState;
    }

}
