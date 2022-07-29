package com.example.starlingui.Dao;

import com.example.starlingui.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface RoleRepository extends MongoRepository<Role, String> {

    @Query(value = "{'name': ?0}")
    Role findByName(String name);
}
