package com.hardlin.springbootinit.model.vo;

import com.hardlin.springbootinit.model.entity.Curriculum;
import lombok.Data;

import java.util.Date;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/1 18:49
 */
@Data
public class CurriculumVO extends Curriculum {
    private String subjectName;
    private String teacherName;
    /**
     *
     */
    private Integer subjectId;
    private Integer stock;
    private Integer allStock;

    /**
     *
     */
    private Integer teacherId;

    /**
     *
     */
    private Date teachingTime;

    /**
     *
     */
    //        "dayOfWeek": 2,
    //        "startTime": 5,
    //        "endTime": 6,
    private Integer dayOfWeek;
    private Integer startTime;
    private Integer endTime;
    private String location;

    private String grade;
    /**
     *
     */
    private String major;
    private Integer isCheck;
    /**
     *
     */
    private String remarks;

    private Date createTime;

    private Date updateTime;
}
     