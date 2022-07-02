package com.example.starlingui.Dao;

import com.example.starlingui.model.StarlingProject;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StarlingProjectRepository extends MongoRepository<StarlingProject, String> {
}
