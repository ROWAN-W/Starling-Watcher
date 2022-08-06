package com.example.starlingui.service;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.util.Config;

import java.io.IOException;

public class deleteServiceImpl implements deleteService{

    @Override
    public void deleteDeployment(String namespace) throws IOException, ApiException {

        // configure k8s client from within the cluster
        ApiClient client = Config.fromCluster();
        Configuration.setDefaultApiClient(client);
/*
  // default config for an out-of-cluster client
        ApiClient client = Config.defaultClient();
        Configuration.setDefaultApiClient(client);

 */
/*      // configure k8s client from a YAML file
        ApiClient kubeApiClient = null;
        try {
            kubeApiClient = Config.fromConfig("/home/flying/.kube/config/k3s.yaml");
        } catch (IOException e) {
            e.printStackTrace();
        }


 */
        CoreV1Api api = new CoreV1Api(client);

         api.deleteNamespace(namespace, null,null,null, null, null,null);

    }
}
