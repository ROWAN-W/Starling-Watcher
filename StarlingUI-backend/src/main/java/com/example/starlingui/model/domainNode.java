package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;


import java.util.List;
import java.util.Map;





@Component
@Data
public class domainNode {

    private int id;
    private String nodeName;
    private String hostname;





    public void setId(int id) {
        this.id = id;
    }



    public int getId() {
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
