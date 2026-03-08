package com.hardlin.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName teacher
 */
@TableName(value ="teacher")
@Data
public class Teacher implements Serializable {
    /**
     * 
     */
    @TableId
    private Integer id;

    /**
     * 教师ID
     */
    private Long teacherId;

    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 教师姓名
     */
    private String teacherName;

    /**
     * 职称级别
     */
    private String level;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}