package com.example.starlingui.service;

import com.example.starlingui.model.domainNode;
import io.kubernetes.client.openapi.ApiException;

import java.io.IOException;
import java.util.List;

public interface NodeService {

    List<domainNode> getNodeList()throws IOException, ApiException;
}
