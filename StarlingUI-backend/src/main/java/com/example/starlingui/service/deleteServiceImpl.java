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

        // default config for an out-of-cluster client
        ApiClient client = Config.defaultClient();
        Configuration.setDefaultApiClient(client);
        client.setConnectTimeout(5000);


/*
    // configure k8s client from a YAML file
        ApiClient client = null;
        try {
            client = Config.fromConfig("/home/flying/.kube/config");
        } catch (IOException e) {
            e.printStackTrace();
        }

 */
/*
   // configure k8s client from within the cluster
        ApiClient client = Config.fromCluster();
        Configuration.setDefaultApiClient(client);

 */
        CoreV1Api api = new CoreV1Api(client);

         api.deleteNamespace(namespace, null,null,null, null, null,null);

    }
}
