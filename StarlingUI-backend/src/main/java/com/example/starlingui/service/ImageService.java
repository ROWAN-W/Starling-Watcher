package com.example.starlingui.service;

import com.example.starlingui.model.Image;
import com.example.starlingui.model.User;

import java.util.List;

public interface ImageService {

    public void setToken(User user);

    public List<Image> getImageList();
}
