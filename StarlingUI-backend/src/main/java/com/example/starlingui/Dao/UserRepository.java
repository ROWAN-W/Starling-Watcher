package com.example.starlingui.Dao;

import com.example.starlingui.model.User;
import org.springframework.data.mongodb.repository.DeleteQuery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    @Query(value = "{'name': ?0}")
    User findByName(String name);

    @Query(value = "{'id': ?0")
    Optional<User> findById(String id);

//    @Query(value = "{'id': ?0", delete = true)
//    void deleteById(String id);

//    List<User> findAll();
}
