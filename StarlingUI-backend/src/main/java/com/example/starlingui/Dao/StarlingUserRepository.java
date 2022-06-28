package com.example.starlingui.Dao;

import com.example.starlingui.model.StarlingUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface StarlingUserRepository extends MongoRepository<StarlingUser, String> {

    @Query(value = "{'name': ?0}")
    StarlingUser findByName(String name);

    @Query(value = "{'id': ?0}")
    Optional<StarlingUser> findById(String id);

//    @Query(value = "{'id': ?0", delete = true)
//    void deleteById(String id);

//    List<User> findAll();
}
