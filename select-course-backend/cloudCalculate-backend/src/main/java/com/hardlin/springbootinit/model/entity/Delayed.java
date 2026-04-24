package com.hardlin.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName delayed
 */
@TableName(value ="delayedes")
@Data
public class Delayed implements Serializable {
    /**
     * 
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 
     */
    private String studyYear;

    /**
     * 
     */
    private Integer srudySchdule;

    /**
     * 缓考原因
     */
    private String des;

    /**
     * 
     */
    private long studentId;

    /**
     * 开课学院
     */
    private String studentcollege;

    private static final long serialVersionUID = 1L;
}