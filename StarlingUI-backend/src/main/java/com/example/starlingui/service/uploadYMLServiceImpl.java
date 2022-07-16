package com.example.starlingui.service;


import io.fabric8.kubernetes.api.model.apps.Deployment;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import io.fabric8.kubernetes.client.KubernetesClientException;

import org.yaml.snakeyaml.*;

import java.io.*;
import java.util.Map;

public class uploadYMLServiceImpl implements uploadYMLService {


    @Override
    public boolean validateYML(File file)  {
        Yaml yaml = new Yaml();


        try{
            InputStream inputStream = new FileInputStream(file);
            Map<String, Object> obj = yaml.load(inputStream);
        }catch (Exception E){
            return false;
        }
       return  true;
    }

    @Override
    public boolean deployYML(File file)  {
        try (KubernetesClient k8s = new KubernetesClientBuilder().build()) {
            // Load Deployment YAML Manifest into Java object
            Deployment deploy1 = k8s.apps().deployments()
                    .load(new FileInputStream(file))
                    .get();
            // Apply it to Kubernetes Cluster
            k8s.apps().deployments().inNamespace("default").create(deploy1);
        }catch(KubernetesClientException kubernetesClientException){
            return  false;
        }catch (FileNotFoundException fileNotFoundException){
            return false;
        }
        return true;
    }
}
