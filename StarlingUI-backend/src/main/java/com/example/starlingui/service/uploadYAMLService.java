package com.example.starlingui.service;

import com.example.starlingui.exceptions.StarlingException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;


public interface uploadYAMLService {


    public void processYAML(MultipartFile file, String namespace) throws StarlingException;

    public void validateYAML(File file) throws StarlingException, FileNotFoundException;

    public void deployYAML(File file, String namespace) throws StarlingException,FileNotFoundException;

}
