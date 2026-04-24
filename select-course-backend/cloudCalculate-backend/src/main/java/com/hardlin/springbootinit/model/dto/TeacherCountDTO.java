package com.hardlin.springbootinit.model.dto;

import lombok.Data;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/6/18 23:43
 */
@Data
public class TeacherCountDTO {
    private String name; // 老师

    private Long studentCount;
    private Long averageScore;
}
     