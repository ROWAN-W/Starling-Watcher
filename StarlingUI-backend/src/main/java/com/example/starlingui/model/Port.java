package com.example.starlingui.model;

public class Port {

    private int containerPort;
    private String protocol;

    public void setContainerPort(int containerPort) {
        this.containerPort = containerPort;
    }
    public int getContainerPort() {
        return containerPort;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }
    public String getProtocol() {
        return protocol;
    }

}
