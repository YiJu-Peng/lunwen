package com.hardlin.springbootinit.model.vo;

import lombok.Data;

import java.util.Date;

/**
 * 课程推荐结果视图对象
 * 
 * @author DawnCclin
 */
@Data
public class CourseRecommendVO {
    
    /**
     * 课程ID
     */
    private Integer curriculumId;
    
    /**
     * 科目ID
     */
    private Integer subjectId;
    
    /**
     * 科目名称
     */
    private String subjectName;
    
    /**
     * 上课时间
     */
    private Date teachingTime;
    
    /**
     * 上课地点
     */
    private String location;
    
    /**
     * 推荐理由
     */
    private String recommendReason;
    
    /**
     * 推荐分数，用于排序
     */
    private Double recommendScore;
} 