package com.example.starlingui.service;

import java.io.File;


public interface uploadYMLService {

    public boolean validateYML(File file) ;

    public boolean deployYML(File file);

}
