package com.example.starlingui.model;


import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class K8sContainer {

    private String containerName;

    private String namespace;

    private String podName;

}
