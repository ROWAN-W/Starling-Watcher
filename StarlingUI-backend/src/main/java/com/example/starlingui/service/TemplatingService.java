package com.example.starlingui.service;
import com.example.starlingui.model.Design;

import java.io.IOException;

public interface TemplatingService {
    String doTemplating(Design JsonOfDesign) throws IOException;

}
