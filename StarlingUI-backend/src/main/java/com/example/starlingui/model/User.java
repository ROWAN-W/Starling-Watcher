package com.example.starlingui.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.stereotype.Component;

@Component
@Data
public class User {

    @Id
    private String id;

    private String username;

    private String password;

    public User(String username,String password){
        this.username = username;
        this.password = password;
    }

    public User() {
        super();
    }

    public String getId() {
        return id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
