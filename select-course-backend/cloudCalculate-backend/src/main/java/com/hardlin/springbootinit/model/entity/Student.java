package com.hardlin.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 
 * @TableName student
 */
@TableName(value ="student")
@Data
public class Student implements Serializable {
    /**
     * 学生ID
     */
    @TableId
    private Integer id;

    /**
     * 学生业务ID
     */
    private Long studentId;
    
    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 学生姓名
     */
    private String studentName;
    
    /**
     * 性别
     */
    private String gender;
    
    /**
     * 年龄
     */
    private Integer age;
    
    /**
     * 年级
     */
    private String grade;
    
    /**
     * 专业
     */
    private String major;
    
    /**
     * 学院
     */
    private String college;
    
    /**
     * 电话号码
     */
    private String phoneNumber;
    
    /**
     * 邮箱
     */
    private String email;
    
    /**
     * 创建时间
     */
    private Date createTime;
    
    /**
     * 将时间同步到最新
     */
    private Date updateTime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}