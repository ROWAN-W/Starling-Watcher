package com.example.starlingui.service;


import com.example.starlingui.exceptions.StarlingException;
import io.fabric8.kubernetes.api.model.Namespace;
import io.fabric8.kubernetes.api.model.NamespaceBuilder;
import io.fabric8.kubernetes.api.model.NamespaceList;
import io.fabric8.kubernetes.api.model.apps.DaemonSet;
import io.fabric8.kubernetes.api.model.apps.Deployment;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import io.fabric8.kubernetes.client.KubernetesClientException;

import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;
import org.yaml.snakeyaml.Yaml;



import java.io.File;
import org.springframework.util.ResourceUtils;
import io.fabric8.kubernetes.api.model.metrics.v1beta1.NodeMetrics;
import io.fabric8.kubernetes.api.model.metrics.v1beta1.NodeMetricsList;
import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClient;

public class uploadYAMLServiceImpl implements uploadYAMLService {

    private ArrayList<File> splitYamlFile(File file) throws  IOException {
        ArrayList<File> files=new ArrayList<>();

        FileReader reader = new FileReader(file);
        BufferedReader buffReader = new BufferedReader(reader);
        String firstLine = buffReader.readLine();
        String newline = System.getProperty("line.separator");
        int id=0;
        File singleFile=new File("temdir"+File.separator+"Parts"+File.separator+"part"+String.valueOf(id)+".yaml");
        while(firstLine!=null){
            if(!firstLine.contains("---"))  {
                FileWriter writer=new FileWriter(singleFile,true);
                BufferedWriter buffWriter=new BufferedWriter(writer);
                buffWriter.write(firstLine+newline);
                buffWriter.flush();
                buffWriter.close();
            }
            else{
                files.add(singleFile);
                id++;
                singleFile=new File("temdir"+File.separator+"Parts"+File.separator+"part"+String.valueOf(id)+".yaml");
            }
            firstLine=buffReader.readLine();
        }
        files.add(singleFile);
        buffReader.close();
        return  files;
    }


    @Override
    public void processYAML(MultipartFile file, String namespace) throws StarlingException {
        if (!file.isEmpty()) {

            try {

                byte[] bytes = file.getBytes();
                File wholeFile=new File("temdir"+File.separator+file.getOriginalFilename());
                BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(wholeFile));
                stream.write(bytes);
                stream.flush();
                stream.close();

                ArrayList<File> files=splitYamlFile(wholeFile);

                if(files.size()==0){
                    throw new StarlingException("Empty File");
                }
                for(int i=0;i<files.size();i++){
                    if(files.get(i).exists()){
                        validateYAML(files.get(i));
                        deployYAML(files.get(i), namespace);}
                }

            } catch (IOException ioException) {
                    throw new StarlingException("File Processing Error");
            }

        } else {
           throw new StarlingException("Empty File");
        }

    }

    public void checkNameSpace(KubernetesClient client, String projectName){
        NamespaceList List = client.namespaces().list();
        java.util.List<Namespace> namespaceList = List.getItems();
        for (Namespace namespace : namespaceList) {
            if (projectName.equals(namespace.getMetadata().getName())) {
                return;
            }
        }
        //add a label for all project deployed from Starling-watcher
        NamespaceBuilder namespaceBuilder = new NamespaceBuilder();
        Namespace newNameSpace = namespaceBuilder.withNewMetadata().addToLabels("deployedfrom", "starlingwatcher").withName(projectName).endMetadata().build();
        client.namespaces().resource(newNameSpace).create();
    }

    @Override
    public void validateYAML(File file) throws StarlingException,FileNotFoundException {
        Yaml yaml = new Yaml();
        try{
            InputStream inputStream = new FileInputStream(file);

            Map<String, Object> obj = yaml.load(inputStream);
        }catch (Exception e){
            throw new StarlingException("Invalid Yaml File");
        }

    }

    @Override
    public void deployYAML(File file, String namespace) throws StarlingException,FileNotFoundException {
/*
        FileReader reader=new FileReader(file);
        BufferedReader bufferedReader=new BufferedReader(reader);
        Yaml yaml = new Yaml();
        InputStream inputStream = new FileInputStream(file);
        Map<String, Object> obj = yaml.load(inputStream);

       switch (obj.get("kind").toString()){
           case "DaemonSet":
               DaemonSet daemonSet=k8s.apps().daemonSets().load(new FileInputStream(file)).get();
               k8s.apps().daemonSets().inNamespace(namespace).create(daemonSet);
       }
   DaemonSet daemonSet=k8s.apps().daemonSets().load(new FileInputStream(file)).get();
                k8s.apps().daemonSets().inNamespace(namespace).create(daemonSet);
            }else {
                // Load Deployment YAML Manifest into Java object

                Deployment deploy = k8s.apps().deployments()
                        .load(new FileInputStream(file))
                        .get();
                // Apply it to Kubernetes Cluster
k8s.apps().deployments().inNamespace(namespace).create(deploy);
 */



        try {
        /*

     //configure a client from a YAML file
            String kubeConfigContents = Files.readString(new File("/home/flying/.kube/config").toPath());
            Config config = Config.fromKubeconfig(kubeConfigContents);
            KubernetesClient client = new KubernetesClientBuilder().withConfig(config).build();

  */


//default client
            KubernetesClient client = new KubernetesClientBuilder().build();



            checkNameSpace(client,namespace);

            client.load(new FileInputStream(file)).inNamespace(namespace).create();



        }catch (IOException ioException){
            throw new StarlingException("file processing error");
        }
        catch(KubernetesClientException kubernetesClientException){
            throw new StarlingException("kubernetes server error");
        }

    }
}
