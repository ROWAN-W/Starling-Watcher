package com.example.starlingui.model;


import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Data
public class monitorNode extends domainNode{

    private String id;
    private String nodeName;

    //fields for monitor page
    private List<monitorContainer> containers;


    public void setContainers(List<monitorContainer> containers) {
        this.containers = containers;
    }

    public void setId(String id) {
        this.id = id;
    }



    public String getId() {
        return id;
    }
    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }


}
