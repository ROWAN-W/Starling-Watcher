package com.example.starlingui.model;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class User {

    @JSONField(name = "username")
    private String username;

    @JSONField(name = "password")
    private String password;

}
