package com.example.starlingui.service;

import com.example.starlingui.model.*;
import io.fabric8.kubernetes.api.model.Pod;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.*;
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

       /* ApiClient kubeApiClient = null;
        try {
            kubeApiClient = Config.fromConfig("/home/flying/.kube/config/k3s.yaml");
        } catch (IOException e) {
            e.printStackTrace();
        }

        */
        ApiClient client = Config.fromCluster();
        Configuration.setDefaultApiClient(client);
        CoreV1Api api = new CoreV1Api(client);

        ArrayList<domainNode> nodes =new ArrayList<>();
        int id=0;

        V1NodeList list = api.listNode(null, null, null, null, null, null, null, null, null,null);
        for (V1Node item : list.getItems()) {

            monitorNode node =new monitorNode();
            //System.out.println(id);
            node.setId(id);
            //System.out.println(item.getMetadata().getName());
            node.setNodeName(item.getMetadata().getName());
            node.setHostname(item.getStatus().getAddresses().get(1).getAddress());
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

            if(item.getSpec().getNodeName().equals(nodeName)&&!item.getMetadata().getNamespace().equals("kube-system")){
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
        ArrayList<monitorContainer> monitorContainers =new ArrayList<>();
        int id=0;

        for(V1ContainerStatus containerStatus: pod.getStatus().getContainerStatuses()){
            monitorContainer monitorContainer =new monitorContainer();
            //System.out.println(String.valueOf(id));
            monitorContainer.setId(String.valueOf(id));
            //System.out.println(pod.getStatus().getContainerStatuses().get(i).getName());
            monitorContainer.setContainerName(containerStatus.getName());
            //System.out.println(pod.getStatus().getContainerStatuses().get(i).getContainerID());
           // domainContainer.setId(pod.getStatus().getContainerStatuses().get(i).getContainerID());
            //System.out.println(pod.getStatus().getContainerStatuses().get(i).getState().getTerminated());
            if(containerStatus.getState().getRunning()!=null){
                monitorContainer.setContainerState("running");
            }
            else if(containerStatus.getState().getTerminated()!=null){
                monitorContainer.setContainerState("terminated");
            }
            else if(containerStatus.getState().getWaiting()!=null){
                monitorContainer.setContainerState("waiting");
            }
            else{
                monitorContainer.setContainerState("null");
            }
            monitorContainers.add(monitorContainer);
            id++;
        }

        return monitorContainers;
    }


}





