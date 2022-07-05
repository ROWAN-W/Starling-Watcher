package com.example.starlingui.service;

public interface StarlingService<Entity> {
    String getAll();
    void initialize();
    String update(String body, String id) throws Exception;
}
