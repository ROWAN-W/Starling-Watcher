package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;


import java.util.List;
import java.util.Map;





@Component
@Data
public class domainNode {

    private String id;
    private String nodeName;
    private String hostname;





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


    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

}
