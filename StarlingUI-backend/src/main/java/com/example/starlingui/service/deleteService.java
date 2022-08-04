package com.example.starlingui.service;

import io.kubernetes.client.openapi.ApiException;

import java.io.IOException;

public interface deleteService {

    public void deleteDeployment(String namespace) throws IOException, ApiException;

}
