package com.example.starlingui.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Collection;

@Document(collection = "StarlingUsers")
@Data
public class StarlingUser {

    @Id
    private String id;
    @Indexed(unique = true)
    private String name;
    private String password;
    private Collection<Role> roles = new ArrayList<>();

    public StarlingUser(String id, String name, String password) {
        this.id = id;
        this.name = name;
        this.password = password;
    }

    public StarlingUser() {
        super();
    }

    public String getId() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }
}
