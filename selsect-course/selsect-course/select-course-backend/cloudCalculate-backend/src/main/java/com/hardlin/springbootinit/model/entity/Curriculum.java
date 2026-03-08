package com.hardlin.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;

import lombok.Data;

/**
 *
 * @TableName curriculum
 */
@TableName(value ="curriculum")
@Data
public class Curriculum implements Serializable {
    /**
     *
     */
    @TableId
    private Integer id;

    /**
     *
     */
    private Integer subjectId;

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
    private String location;

    private String grade;
    private Integer stock;
    private Integer allStock;
    private Integer isStock;
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
    @TableLogic
    private Integer isDelete;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}