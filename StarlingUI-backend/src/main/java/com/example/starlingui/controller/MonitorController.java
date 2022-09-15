package com.example.starlingui.controller;

import com.example.starlingui.model.K8sContainer;
import com.example.starlingui.model.domainNode;

import com.example.starlingui.model.monitorNode;
import com.example.starlingui.service.deleteServiceImpl;
import com.example.starlingui.service.designNodeServiceImpl;

import com.example.starlingui.service.monitorNodeServiceImpl;
import com.google.gson.Gson;
import io.kubernetes.client.PodLogs;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Namespace;
import io.kubernetes.client.openapi.models.V1NamespaceList;
import io.kubernetes.client.openapi.models.V1ServiceList;
import io.kubernetes.client.util.Config;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
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
            // default config for an out-of-cluster client
            ApiClient client = Config.defaultClient();
            Configuration.setDefaultApiClient(client);
            client.setConnectTimeout(5000);

/*

 // configure k8s client from a file
                ApiClient client = null;
                client = Config.fromConfig("/home/flying/.kube/config");

   // configure k8s client from within the cluster
        ApiClient client = Config.fromCluster();
        Configuration.setDefaultApiClient(client);

 */
            CoreV1Api api = new CoreV1Api(client);

           api.deleteNamespacedPod(podName,namespace,null,null,null,null,null,null);
           return ResponseEntity.ok("ok");
       }catch (ApiException apiException){

            if(apiException.getMessage().contains("NotFound")){
                return ResponseEntity.ok("ok");
            }else{
                return ResponseEntity
                        .status(404)
                        .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                        .body("Kubernetes API error :" + apiException.getMessage());
            }


       }catch (IOException ioException){
            return ResponseEntity
                    .status(404)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body("Kubernetes API error :" + ioException.getMessage());
        }
      
    }

    @GetMapping("/namespaces")
    public ResponseEntity<String> getNameSpace(){
        try {
            ApiClient client = Config.defaultClient();
            Configuration.setDefaultApiClient(client);
            CoreV1Api api = new CoreV1Api();
            //filtering namespaces with label:  deployedfrom=starlingwatcher
            V1NamespaceList namespaceList = api.listNamespace(
                    null,
                    null,
                    null,
                    null,
                    "deployedfrom=starlingwatcher",
                    null,
                    null,
                    null,
                    Integer.MAX_VALUE,
                    null);
            List<String> list = namespaceList
                    .getItems()
                    .stream()
                    .map(v1Namespace -> v1Namespace.getMetadata().getName())
                    .collect(Collectors.toList());


            Gson gson = new Gson();
            String json = gson.toJson(list);
            return ResponseEntity.ok(json);

        }catch (Exception e){

            return ResponseEntity
                    .status(404)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body("Unable to get the namespaces" +System.lineSeparator()+ e.getMessage());
        }
    }


    @DeleteMapping("/delete/{namespace}")
    public ResponseEntity<String> deleteDeploymentsInNS(@PathVariable String namespace){
        deleteServiceImpl deleteServiceImpl=new deleteServiceImpl();
        try {
            deleteServiceImpl.deleteDeployment(namespace);
            return ResponseEntity.ok("ok");
        }catch (Exception e){
            return ResponseEntity
                    .status(404)
                    .header(HttpHeaders.CONTENT_TYPE, "text/plain")
                    .body("Unable to delete the project"+namespace +System.lineSeparator()+ e.getMessage());
        }

    }
}
