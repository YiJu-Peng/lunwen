package com.hardlin.springbootinit.model.dto;

import lombok.Data;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/6/18 23:15
 */
@Data
public class ReasonCountDTO {
    private String name; // 缓考原因
    private Long value; // 条目数

    // Getter and Setter methods
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getValue() {
        return value;
    }

    public void setValue(Long value) {
        this.value = value;
    }
}
     