package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@Data
public class designNode extends domainNode{

    private String role;
    private String ip;

    private String architecture;
    private String creationTime;
    private Map<String,String> labels;
    private Map<String,String> annotations;



    public String getRole() {
        return role;
    }

    public void setArchitecture(String architecture) {
        this.architecture = architecture;
    }

    public void setCreationTime(String creationTime) {
        this.creationTime = creationTime;
    }




    public void setIp(String ip) {
        this.ip = ip;
    }
    public void setAnnotations(Map<String, String> annotations) {
        this.annotations = annotations;
    }



    public void setLabels(Map<String, String> labels) {
        this.labels = labels;
        this.role="worker";
        labels.keySet().forEach(key->{
            if(key.contains("master")){
                this.role="master";
            }
        });
    }




    public void setRole(String role) {
        this.role = role;
    }

}
