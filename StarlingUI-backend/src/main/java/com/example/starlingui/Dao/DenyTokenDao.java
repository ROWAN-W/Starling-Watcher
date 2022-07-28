package com.example.starlingui.Dao;

import com.example.starlingui.model.DenyToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class DenyTokenDao implements Dao<DenyToken> {

    @Autowired
    DenyTokenRepository repo;
    @Override
    public void save(DenyToken denyToken) {
        repo.save(denyToken);
    }

    @Override
    public Optional<DenyToken> getById(String id) {
        return repo.findById(id);
    }

    @Override
    public List<DenyToken> findAll() {
        return repo.findAll();
    }

    @Override
    public void deleteAll() {
        repo.deleteAll();
    }

    public boolean accessTokenExists(String token) {
        DenyToken denyToken = repo.findDenyTokenByAccessToken(token);
        return denyToken == null;
    }

    public boolean refreshTokenExists(String token) {
        DenyToken denyToken = repo.findDenyTokenByRefreshToken(token);
        return denyToken == null;
    }

    public void deleteCreatedBefore(Date date) {
        repo.deleteDenyTokensByCreateAtBefore(date);
    }
}
