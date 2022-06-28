package com.example.starlingui.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.stereotype.Component;

@Component
@Data
public class StarlingUser {

    @Id
    private String id;

    private String name;
    private String password;

    public StarlingUser(String name, String password) {
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
