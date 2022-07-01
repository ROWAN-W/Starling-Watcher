package com.example.starlingui.Dao;

import java.util.List;
import java.util.Optional;

public interface Dao<Entity> {
    void save(Entity entity);
    Optional<Entity> getById(String id);
    List<Entity> findAll();
    void deleteAll();
//    void update(Entity entity);
//    void deleteById(String id);
}
