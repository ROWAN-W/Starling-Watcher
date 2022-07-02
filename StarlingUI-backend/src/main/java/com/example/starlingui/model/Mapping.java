package com.example.starlingui.model;


import java.util.ArrayList;

public class Mapping {

    private String nodeID;
    private ArrayList<String> mappedDrones;

    public Mapping(){
        mappedDrones =  new ArrayList<>();
    }

    public void setMappedDrones(ArrayList<String> mappedDrones) {
        this.mappedDrones = mappedDrones;
    }

    public void setNodeID(String nodeID) {
        this.nodeID = nodeID;
    }

    public String getNodeID() {
        return nodeID;
    }

    public ArrayList<String> getNodeNameList(){
        return mappedDrones;
    }

}
