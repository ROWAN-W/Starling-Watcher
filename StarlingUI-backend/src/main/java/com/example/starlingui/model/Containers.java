package com.example.starlingui.model;

import java.util.List;

public class Containers {
    private int id;
    private String name;
    private String command;
    private String args;
    private List<Env> env;
    private List<Port> port;

    public void setId(int id) {
        this.id = id;
    }
    public int getId() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }

    public void setCommand(String command) {
        this.command = command;
    }
    public String getCommand() {
        return command;
    }

    public void setArgs(String args) {
        this.args = args;
    }
    public String getArgs() {
        return args;
    }

    public void setEnv(List<Env> env) {
        this.env = env;
    }
    public List<Env> getEnv() {
        return env;
    }

    public void setPort(List<Port> port) {
        this.port = port;
    }
    public List<Port> getPort() {
        return port;
    }

}

