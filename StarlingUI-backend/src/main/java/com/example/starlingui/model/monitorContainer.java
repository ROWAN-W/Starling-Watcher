package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class monitorContainer {
    private String id;
    private String containerName;
    //private String containerID;

    private String podName;
    private String namespace;

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

   /* public void setContainerID(String containerID) {
        this.containerID = containerID;
    }

    */


    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public void setPodName(String podName) {
        this.podName = podName;
    }
}
