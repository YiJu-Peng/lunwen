package com.hardlin.springbootinit.model.dto;

import lombok.Data;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/6/19 20:12
 */
@Data
public class CourseAverageScoreDTO {
    private String subjectName;
    private Integer subjectId;
    private Double averageScore;
}
     