package com.example.starlingui.service;

import com.example.starlingui.Dao.DenyTokenDao;
import com.example.starlingui.model.DenyToken;
import com.example.starlingui.security.JwtTokenUtil;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class StarlingDenyTokenServiceImpl implements StarlingService<DenyToken> {

    @Autowired
    private DenyTokenDao tokenDao;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public String getAll() {
        JSONArray ja = new JSONArray(tokenDao.findAll());
        return ja.toString();
    }

    @Override
    public void initialize() {
        tokenDao.deleteAll();
    }

    public void save(String body) throws Exception {
        JSONObject jsonObject = new JSONObject(body);
        String accessToken = jsonObject.getString("accessToken");
        String refreshToken = jsonObject.getString("refreshToken");
        tokenDao.save(new DenyToken(accessToken, refreshToken));
        Date date = new Date(System.currentTimeMillis() - jwtTokenUtil.getRefreshAvailableTime());
        tokenDao.deleteCreatedBefore(date);
    }
}
