package com.example.starlingui.model;


import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Data
public class monitorNode extends domainNode{


    //fields for monitor page
    private List<monitorPod> pods;


    public void setPods(List<monitorPod> Pods) {
        this.pods = Pods;
    }

}
