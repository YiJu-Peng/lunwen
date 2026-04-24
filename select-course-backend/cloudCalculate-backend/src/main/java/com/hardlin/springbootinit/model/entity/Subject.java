package com.hardlin.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName subject
 */
@TableName(value ="subject")
@Data
public class Subject implements Serializable {
    /**
     * 
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 
     */
    private String subjectName;

    /**
     * 
     */
//    private String subjectDes;

    /**
     * 课程学分
     */
    private double credit;
    private String college;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}