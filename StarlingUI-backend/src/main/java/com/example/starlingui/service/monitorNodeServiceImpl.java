package com.example.starlingui.service;

import com.example.starlingui.model.domainContainer;
import com.example.starlingui.model.domainNode;
import com.example.starlingui.model.domainPod;
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
    private List<domainPod> getPodsOfNode (String nodeName, CoreV1Api api) throws ApiException{
        int id=0;
        ArrayList<domainPod> domainPods =new ArrayList<>();
        V1PodList list=api.listPodForAllNamespaces(null,null,null,null,null,null,null,null,null,null);
        for(V1Pod item:list.getItems()){

            if(item.getSpec().getNodeName().equals(nodeName)){
                //System.out.println(item.getStatus().getNominatedNodeName()+" "+nodeName);
                domainPod domainPod =new domainPod();
                //System.out.println(String.valueOf(id));
                domainPod.setId(String.valueOf(id));
                //System.out.println(item.getMetadata().getName());
                domainPod.setPodName(item.getMetadata().getName());
                //System.out.println(item.getMetadata().getNamespace());
                domainPod.setNamespace(item.getMetadata().getNamespace());
                //get containers
                domainPod.setContainers(getContainersOfPod(item));
                domainPods.add(domainPod);
                id++;
            }


        }
        return domainPods;
    }


    /**
     * @Description get all containers of a pod
     * @param pod
     * @return list of domain containers
     * @throws ApiException
     */

    private List<domainContainer> getContainersOfPod (V1Pod pod) throws ApiException{
        ArrayList<domainContainer> domainContainers =new ArrayList<>();
        int id=0;
        for(int i=0;i<pod.getStatus().getContainerStatuses().size();i++){
            domainContainer domainContainer =new domainContainer();
            //System.out.println(String.valueOf(id));
            domainContainer.setId(String.valueOf(id));
            //System.out.println(pod.getStatus().getContainerStatuses().get(i).getName());
            domainContainer.setContainerName(pod.getStatus().getContainerStatuses().get(i).getName());
            //System.out.println(pod.getStatus().getContainerStatuses().get(i).getContainerID());
            domainContainer.setId(pod.getStatus().getContainerStatuses().get(i).getContainerID());
            //System.out.println(pod.getStatus().getContainerStatuses().get(i).getState().getTerminated());
            if(pod.getStatus().getContainerStatuses().get(i).getState().getRunning()!=null){
                domainContainer.setContainerState("running");
            }
            else if(pod.getStatus().getContainerStatuses().get(i).getState().getTerminated()!=null){
                domainContainer.setContainerState("terminated");
            }
            else if(pod.getStatus().getContainerStatuses().get(i).getState().getWaiting()!=null){
                domainContainer.setContainerState("waiting");
            }
            else{
                domainContainer.setContainerState("null");
            }
            domainContainers.add(domainContainer);
            id++;
        }

        return domainContainers;
    }


}





