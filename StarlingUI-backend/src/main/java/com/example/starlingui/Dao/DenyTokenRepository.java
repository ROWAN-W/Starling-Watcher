package com.example.starlingui.Dao;

import com.example.starlingui.model.DenyToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;

public interface DenyTokenRepository extends MongoRepository<DenyToken, String> {
    void deleteDenyTokensByCreateAtBefore(Date date);
    DenyToken findDenyTokenByAccessToken(String accessToken);
    DenyToken findDenyTokenByRefreshToken(String refreshToken);
}
