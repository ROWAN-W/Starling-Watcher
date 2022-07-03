package com.example.starlingui.service;


import com.example.starlingui.model.domainNode;
import com.example.starlingui.model.monitorContainer;
import com.example.starlingui.model.monitorPod;
import com.example.starlingui.model.monitorNode;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Node;
import io.kubernetes.client.openapi.models.V1NodeList;
import io.kubernetes.client.openapi.models.V1Pod;
import io.kubernetes.client.openapi.models.V1PodList;
import io.kubernetes.client.util.Config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class monitorNodeServiceImpl implements NodeService{
    /**
     * @Description get all available nodes from kubernetes API for monitor page
     * @return List<domainNode>
     * @throws IOException
     * @throws ApiException
     */
    @Override
    public List<domainNode> getNodeList() throws IOException, ApiException {

        ApiClient client = Config.defaultClient();
        Configuration.setDefaultApiClient(client);

        CoreV1Api api = new CoreV1Api();

        ArrayList<domainNode> nodes =new ArrayList<>();
        int id=0;

        V1NodeList list = api.listNode(null, null, null, null, null, null, null, null, null,null);
        for (V1Node item : list.getItems()) {

            monitorNode node =new monitorNode();
            //System.out.println(id);
            node.setId(String.valueOf(id));
            //System.out.println(item.getMetadata().getName());
            node.setNodeName(item.getMetadata().getName());

            //get pods
            node.setPods(getPodsOfNode(node.getNodeName(),api));

            nodes.add(node);
            id++;
        }

        return nodes;
    }

    /**
     * @Description get all pods running on a node
     * @param nodeName
     * @param api
     * @return List<Pod>
     * @throws ApiException
     */
    private List<monitorPod> getPodsOfNode (String nodeName, CoreV1Api api) throws ApiException{
        int id=0;
        ArrayList<monitorPod> monitorPods =new ArrayList<>();
        V1PodList list=api.listPodForAllNamespaces(null,null,null,null,null,null,null,null,null,null);
        for(V1Pod item:list.getItems()){

            if(item.getSpec().getNodeName().equals(nodeName)){
                //System.out.println(item.getStatus().getNominatedNodeName()+" "+nodeName);
                monitorPod monitorPod =new monitorPod();
                //System.out.println(String.valueOf(id));
                monitorPod.setId(String.valueOf(id));
                //System.out.println(item.getMetadata().getName());
                monitorPod.setPodName(item.getMetadata().getName());
                //System.out.println(item.getMetadata().getNamespace());
                monitorPod.setNamespace(item.getMetadata().getNamespace());
                //get containers
                monitorPod.setContainers(getContainersOfPod(item));
                monitorPods.add(monitorPod);
                id++;
            }


        }
        return monitorPods;
    }


    /**
     * @Description get all containers of a pod
     * @param pod
     * @return list of domain containers
     * @throws ApiException
     */

    private List<monitorContainer> getContainersOfPod (V1Pod pod) throws ApiException{
        ArrayList<monitorContainer> containers =new ArrayList<>();
        int id=0;
        for(int i=0;i<pod.getStatus().getContainerStatuses().size();i++){
            monitorContainer container =new monitorContainer();
            //System.out.println(String.valueOf(id));
            container.setId(String.valueOf(id));
            //System.out.println(pod.getStatus().getContainerStatuses().get(i).getName());
            container.setContainerName(pod.getStatus().getContainerStatuses().get(i).getName());
            //System.out.println(pod.getStatus().getContainerStatuses().get(i).getContainerID());
            container.setContainerID(pod.getStatus().getContainerStatuses().get(i).getContainerID());
            //System.out.println(pod.getStatus().getContainerStatuses().get(i).getState().getTerminated());
            if(pod.getStatus().getContainerStatuses().get(i).getState().getRunning()!=null){
                container.setContainerState("running");
            }
            else if(pod.getStatus().getContainerStatuses().get(i).getState().getTerminated()!=null){
                container.setContainerState("terminated");
            }
            else if(pod.getStatus().getContainerStatuses().get(i).getState().getWaiting()!=null){
                container.setContainerState("waiting");
            }
            else{
                container.setContainerState("null");
            }
            containers.add(container);
            id++;
        }

        return containers;
    }


}





