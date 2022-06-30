package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.*;




@Component
@Data
public class Node {

    private String id;
    private String nodeName;
    private String role;
    private String ip;
    private String hostname;
    private String architecture;
    private String creationTime;
    private Map<String,String> labels;
    private Map<String,String> annotations;

    //fields for monitor page
    private List<Pod> pods;




    public void setId(String id) {
        this.id = id;
    }

    public void setAnnotations(Map<String, String> annotations) {
        this.annotations = annotations;
    }



    public Map<String, String> getAnnotations() {
        return annotations;
    }

    public Map<String, String> getLabels() {
        return labels;
    }

    public String getArchitecture() {
        return architecture;
    }

    public String getCreationTime() {
        return creationTime;
    }

    public String getHostname() {
        return hostname;
    }

    public String getId() {
        return id;
    }

    public String getRole() {
        return role;
    }

    public void setArchitecture(String architecture) {
        this.architecture = architecture;
    }

    public void setCreationTime(String creationTime) {
        this.creationTime = creationTime;
    }

    public String getIp() {
        return ip;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public void setIp(String ip) {
        this.ip = ip;
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

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public List<Pod> getPods() {
        return pods;
    }

    public void setPods(List<Pod> pods) {
        this.pods = pods;
    }


}
