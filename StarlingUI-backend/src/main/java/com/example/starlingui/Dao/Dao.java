package com.example.starlingui.Dao;

import java.util.Optional;

public interface Dao<Entity> {
    void save(Entity entity);
    Optional<Entity> getById(String id);
//    void update(Entity entity);
//    void deleteById(String id);
}
