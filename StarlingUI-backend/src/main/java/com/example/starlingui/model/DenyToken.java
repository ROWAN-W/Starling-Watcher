package com.example.starlingui.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "DenyTokens")
@Data
public class DenyToken {

    @Id
    private String id;

    private String accessToken;
    private String refreshToken;
    private Date createAt;

    public DenyToken() {
        super();
    }

    public DenyToken(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        createAt = new Date();
    }
}
