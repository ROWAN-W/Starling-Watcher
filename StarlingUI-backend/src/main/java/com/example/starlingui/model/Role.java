package com.example.starlingui.model;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class Role {
    @Id
    private String id;
    private String name;

    public Role() {
        super();
    }

    public Role(String name) {
        this.name = name;
    }
}
