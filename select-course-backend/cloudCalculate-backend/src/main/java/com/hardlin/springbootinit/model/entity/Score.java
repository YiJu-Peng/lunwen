package com.hardlin.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName score
 */
@TableName(value ="score")
@Data
public class Score implements Serializable {
    /**
     * 
     */
    @TableId(type = IdType.AUTO)
    private long id;

    /**
     * 
     */
    private String sutdyYear;

    private Integer studySchdule;

    /**
     * 
     */

    private Long studentId;

    /**
     * 
     */
    private Integer subjectId;

    /**
     * 
     */
    private Double ususalScore;

    /**
     * 
     */
    private Double testScore;

    /**
     * 
     */
    private Double lastScore;
    private Double experimentalScore;

    /**
     * 
     */
    private Double againScore;

    /**
     * 
     */
    private Double gpa;

    /**
     * 
     */
    private String teacherName;

    /**
     * 
     */
    private Integer classId;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;


}