package com.example.starlingui.controller;

import com.example.starlingui.model.domainNode;
import com.example.starlingui.service.designNodeServiceImpl;
import com.example.starlingui.service.monitorNodeServiceImpl;
import com.google.gson.Gson;
import io.kubernetes.client.openapi.ApiException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/monitor")
public class MonitorController {

    /**
     * @Description Get request (available nodes)
     * @return ResponseEntity<String>
     */

    @GetMapping("/nodes")
    public ResponseEntity<String> getAvailableNodes() {
        try {
            monitorNodeServiceImpl monitorNodeServiceImpl = new monitorNodeServiceImpl();
            List<domainNode> monitorNodeList = monitorNodeServiceImpl.getNodeList();
            Gson gson = new Gson();
            String json = gson.toJson(monitorNodeList);
            return ResponseEntity.ok(json);
        } catch (ApiException apiException) {
            return ResponseEntity
                    .status(404)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body("Kubernetes API fail :" + apiException.getMessage());
        } catch (IOException ioException) {
            return ResponseEntity
                    .status(404)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body("Kubernetes API fail :" + ioException.getMessage());
        }
    }


}
