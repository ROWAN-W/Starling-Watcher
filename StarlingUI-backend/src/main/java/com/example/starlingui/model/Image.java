package com.example.starlingui.model;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class Image {

    private long id;

    private String name;

    private String lastUpdated;

}
