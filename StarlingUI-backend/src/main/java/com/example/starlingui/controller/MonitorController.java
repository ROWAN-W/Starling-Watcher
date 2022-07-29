package com.example.starlingui.controller;

import com.example.starlingui.model.K8sContainer;
import com.example.starlingui.model.domainNode;

import com.example.starlingui.model.monitorNode;
import com.example.starlingui.service.designNodeServiceImpl;

import com.example.starlingui.service.monitorNodeServiceImpl;
import com.google.gson.Gson;
import io.kubernetes.client.PodLogs;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.util.Config;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/monitor")
public class MonitorController {

    /**
     * @return ResponseEntity<String>
     * @Description Get request (available nodes)
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

    /**
     * @Description restart a certain pod in a certain namespace
     * @param namespace
     * @param podName
     * @return ResponseEntity<String>
     */

    @DeleteMapping("restart/{namespace}/{podName}")
    public ResponseEntity<String> restartPod(@PathVariable String namespace,@PathVariable String podName){

        try {
            ApiClient client = Config.defaultClient();
            Configuration.setDefaultApiClient(client);

            CoreV1Api api = new CoreV1Api(client);

           api.deleteNamespacedPod(podName,namespace,null,null,null,null,null,null);
           return ResponseEntity.ok("ok");
       }catch (ApiException apiException){

           return ResponseEntity
                   .status(404)
                   .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                   .body("Kubernetes API fail :" + apiException.getMessage());
       }catch (IOException ioException){
           return ResponseEntity
                   .status(404)
                   .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                   .body("Kubernetes API fail :" + ioException.getMessage());
       }

      
    }


}
