package com.example.starlingui.service;


import com.example.starlingui.model.*;
import io.fabric8.kubernetes.api.model.*;
import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.api.model.apps.DeploymentBuilder;
import io.fabric8.kubernetes.client.ConfigBuilder;
import org.springframework.stereotype.Service;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class TemplatingServiceImp implements TemplatingService {
    //private static final ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);

    public TemplatingServiceImp() {}

    @Override
    public String doTemplating(Design JsonOfDesign){
        String projectName = JsonOfDesign.getName();
        io.fabric8.kubernetes.client.Config config = new ConfigBuilder().build();

        final KubernetesClient client = new KubernetesClientBuilder().withConfig(config).build();
            List<Configuration> configList = JsonOfDesign.getConfig();
            //Loop through every Config and do templating then deploy one by one。
            for (Configuration configOfDesign : configList) {
                List<Containers> containersArray = configOfDesign.getContainers();
                if (containersArray != null) {
                    String deploymentName = configOfDesign.getName().toLowerCase();
                    Deployment deployment = deploymentTemplating(configOfDesign);
                    String id = configOfDesign.getId();
                    //add node selector part to the deployment object
                    ArrayList<String> nodeNameList = getMapping(id, JsonOfDesign);
                    if (nodeNameList.size() > 0) {
                        for (String nodeName : nodeNameList) {
                            deployment.getMetadata().setName(deploymentName + "-" + nodeName);
                            deployment.getSpec().getTemplate().getSpec().setNodeName(nodeName);
                            //Deploy at here
                            // Node name will define which node to deploy.
                            client.apps().deployments().inNamespace(projectName).resource(deployment).createOrReplace();
                            //return mapper.writeValueAsString(deployment);
                        }
                    }
                }
            }
        return "Deploy Completed";
    }

    public Deployment deploymentTemplating(Configuration configOfDesign){
        String kind = configOfDesign.getKind();
        Deployment deployment = generateDeploymentTemplate(configOfDesign);
        PodSpecBuilder pod = setPodSpec(configOfDesign, kind);
        //After building the Pod spec completely, we can set this pod spec to the Deployment object we've created.
        deployment.getSpec().getTemplate().setSpec(pod.build());
        return deployment;
    }

    public Deployment generateDeploymentTemplate(Configuration configOfDesign){
        String deploymentName = configOfDesign.getName().toLowerCase();
        Map<String, String> labelMap = configOfDesign.getLabel();
        labelMap.put("Internal-label","RTYHP");
        Map<String, String> MatchLabels = getMatchLabels(deploymentName);
        MatchLabels.put("Internal-label","RTYHP");
        //Create a Deployment object template which ends with metadata part.（Doesn't include the spec info）
        return new DeploymentBuilder()
                .withApiVersion("apps/v1")
                .withKind("Deployment")
                .withNewMetadata()
                .addToLabels(labelMap)
                .endMetadata()
                .withNewSpec()
                .withReplicas(1)
                .withNewSelector()
                .withMatchLabels(MatchLabels)
                .endSelector()
                .withNewTemplate()
                .withNewMetadata()
                .addToLabels(MatchLabels)
                .endMetadata()
                .endTemplate()
                .endSpec()
                .build();
    }

    public PodSpecBuilder setPodSpec(Configuration configOfDesign, String kind){
        PodSpecBuilder pod = new PodSpecBuilder();
        //set default HostNetwork and ShareProcessNamespace;
        pod.build().setHostNetwork(true);
        pod.build().setShareProcessNamespace(true);
        //set Toleration & Volumes
        pod.withTolerations(getToleration(kind));
        if(!kind.equalsIgnoreCase("master")) {
            pod.withVolumes(getVolumes());
        }
        // containers spec templating
        List<Containers> containersArray = configOfDesign.getContainers();
        pod = getContainerSpec(containersArray, pod);
        return pod;
    }

    public PodSpecBuilder getContainerSpec(List<Containers> containersArray, PodSpecBuilder pod){
        //get containers info
        for(int i = 0; i < containersArray.size(); i++) {
            ContainerBuilder container = new ContainerBuilder();
            pod.addNewContainer().endContainer();
            Containers ANodeDesign = containersArray.get(i);
            String image = ANodeDesign.getName();
            String[] imageSplit = image.toLowerCase().split(":");
            //extract the image name before ":" and replace the possible symbol in image name to "-".
            //to meet the naming requirement in kubernetes
            String containerName = imageSplit[0].replaceAll("[_/+.^:,]", "-");
            String command = ANodeDesign.getCommand();
            String args = ANodeDesign.getArgs();
            List<Env> envArray = ANodeDesign.getEnv();
            List<Port> portArray = ANodeDesign.getPort();
            //basic container setting
            container.withName(containerName).withImage(image).withImagePullPolicy("Always");
            if(command != null && !command.equals("")){
                container.withCommand(command);
            }
            if(args != null && !args.equals("")){
                container.withArgs(args);
            }
            //set Env & Port
            container = getEnvList(container, envArray);
            container = getPortList(container, portArray);
            pod.setToContainers(i, container.build());
        }
        return pod;
    }


    public ContainerBuilder getEnvList(ContainerBuilder container, List<Env> envArray){
        if(envArray.size() >= 1 && envArray.get(0).getName() != null) {
            List<EnvVar> envVarList = new ArrayList<>();
            for (Env env : envArray) {
                EnvVar envVar = new EnvVar();
                envVar.setName(env.getName());
                envVar.setValue(env.getValue());
                envVarList.add(envVar);
            }
            container.withEnv(envVarList);
        }
        return container;
    }


    public ContainerBuilder getPortList(ContainerBuilder container, List<Port> portArray){
        if(portArray.size() >= 1 && portArray.get(0).getContainerPort() != 0) {
            List<ContainerPort> containerPortList = new ArrayList<>();
            for (Port port : portArray) {
                ContainerPort containerPort = new ContainerPort();
                if (port.getContainerPort() != 0) {
                    containerPort.setContainerPort(port.getContainerPort());
                    containerPort.setProtocol(port.getProtocol());
                }
                containerPortList.add(containerPort);
            }
            container.withPorts(containerPortList);
        }
        return container;
    }

    public Toleration getToleration(String kind){
        TolerationBuilder toleration = new TolerationBuilder();
        if(kind.equalsIgnoreCase("deployment")) {
            toleration.withKey("starling.dev/type").withOperator("Equal")
                    .withValue("vehicle").withEffect("NoSchedule");
        }
        if(kind.equalsIgnoreCase("master")){
            toleration.withKey("node-role.kubernetes.io/master").withOperator("Exists")
                    .withEffect("NoSchedule");
        }

        return toleration.build();
    }

    public Volume getVolumes(){
        VolumeBuilder volumes = new VolumeBuilder();
        volumes.withName("vehicleconfig").withNewHostPath("/etc/starling/vehicle.config", "File");
        return volumes.build();
    }

    public ArrayList<String> getMapping(String id, Design JsonOfDesign){
        List<Mapping> mapping = JsonOfDesign.getMapping();
        //HashMap<String, String> nodeSelector = mapping.get(0).get(id);
        ArrayList<String> nodeNameList = new ArrayList<>();
        for (Mapping value : mapping) {
            if (value.getNodeID().equals(id)) {
                nodeNameList = value.getNodeNameList();
            }
        }
        return nodeNameList ;
    }

    public Map<String, String> getMatchLabels(String nodeName){
        //spec.selector.matchLabels and spec.template.metadata.labels will be the same as the pod name.
        Map<String, String> MatchLabelMap = new HashMap<>();
        MatchLabelMap.put("name", nodeName);
        return MatchLabelMap;
    }


}