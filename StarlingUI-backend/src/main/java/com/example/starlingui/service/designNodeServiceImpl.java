package com.example.starlingui.service;

import com.example.starlingui.model.designNode;
import com.example.starlingui.model.domainNode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.*;
import io.kubernetes.client.util.Config;



import java.util.*;

import java.io.IOException;

@Service
public class designNodeServiceImpl implements NodeService {

    /**
     * @Description get all available nodes from kubernetes API
     * @return List<Node>
     * @throws IOException
     * @throws ApiException
     */
    @Override
    public List<domainNode> getNodeList() throws IOException, ApiException {



       ApiClient client = Config.fromCluster();
     Configuration.setDefaultApiClient(client);
/*
        ApiClient kubeApiClient = null;
        try {
            kubeApiClient = Config.fromConfig("/home/flying/.kube/config/k3s.yaml");
        } catch (IOException e) {
            e.printStackTrace();
        }


 */
        CoreV1Api api = new CoreV1Api(client);

        ArrayList<domainNode> nodes =new ArrayList<>();
        int id=0;

        V1NodeList list = api.listNode(null, null, null, null, null, null, null, null, null,null);
        for (V1Node item : list.getItems()) {

            designNode node =new designNode();
            //System.out.println(id);
           node.setId(id);
            //System.out.println(item.getMetadata().getName());
            node.setNodeName(item.getMetadata().getName());
            //System.out.println(item.getMetadata().getLabels());
            node.setLabels(item.getMetadata().getLabels());
            //System.out.println(item.getMetadata().getAnnotations());
            node.setAnnotations(item.getMetadata().getAnnotations());
           // System.out.println(item.getStatus().getAddresses().get(0).getAddress());
            node.setIp(item.getStatus().getAddresses().get(0).getAddress());
           // System.out.println(item.getStatus().getAddresses().get(1).getAddress());
            node.setHostname(item.getStatus().getAddresses().get(1).getAddress());
           // System.out.println(item.getMetadata().getCreationTimestamp());
            node.setCreationTime(item.getMetadata().getCreationTimestamp().toString());
            //System.out.println(item.getStatus().getNodeInfo().getArchitecture());
            node.setArchitecture(item.getStatus().getNodeInfo().getArchitecture());


            nodes.add(node);
            id++;


        }

        return nodes;
    }




}





