package com.example.starlingui.service;

import com.example.starlingui.model.Image;
import com.example.starlingui.model.User;

import java.util.List;

public interface ImageService {

    void setToken(User user);

    List<Image> getImageList();

}
