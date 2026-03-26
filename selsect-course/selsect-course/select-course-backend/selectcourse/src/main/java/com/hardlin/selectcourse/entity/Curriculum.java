package com.hardlin.selectcourse.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
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
     * 课程ID
     */
    @TableId
    private Long id;

    /**
     * 科目ID
     */
    private Long subjectId;

    /**
     * 教师ID
     */
    private Long teacherId;

    /**
     * 教学时间
     */
    private Date teachingTime;

    /**
     * 星期几，1-7表示周一到周日
     */
    private Integer dayOfWeek;

    /**
     * 上课开始时间，例如1表示第一节课
     */
    private Integer startTime;

    /**
     * 上课结束时间，例如2表示第二节课
     */
    private Integer endTime;

    /**
     * 上课地点
     */
    private String location;
    
    /**
     * 年级
     */
    private String grade;
    
    /**
     * 专业
     */
    private String major;
    
    /**
     * 审核状态，1表示已审核
     */
    private Integer isCheck;
    
    /**
     * 备注信息
     */
    private String remarks;

    /**
     * 课程库存/剩余名额
     */
    private Integer stock;

    private Integer allStock;
    /**
     * 是否有库存限制
     */
    private Integer isStock;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    /**
     * 将时间同步到最新
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

    /**
     * 教师名称（非数据库字段）
     */
    @TableField(exist = false)
    private String teacherName;

    /**
     * 课程名称（非数据库字段）
     */
    @TableField(exist = false)
    private String subjectName;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}