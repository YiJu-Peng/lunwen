package com.hardlin.springbootinit.model.dto;

import lombok.Data;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/6/19 19:11
 */
@Data
public class UsualScoreDTO {
    private String scoreRange;
    private Integer totalInRange;
    private Integer failCount;
    private Double failRate;
}
     