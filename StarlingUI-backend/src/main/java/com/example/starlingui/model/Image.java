package com.example.starlingui.model;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class Image {

    @JSONField(name = "id")
    private long id;

    @JSONField(name = "name")
    private String name;

    @JSONField(name = "lastUpdated")
    private String lastUpdated;

}
