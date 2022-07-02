package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class User {

    private String username;

    private String password;

    public User(String username,String password){
        this.username = username;
        this.password = password;
    }

    public User() {
        super();
    }


    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
