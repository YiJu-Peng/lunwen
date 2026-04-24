package com.hardlin.selectcourse.entity;

import lombok.Data;
import java.util.Date;

/**
 * 课程表项数据传输对象
 */
@Data
public class ScheduleCourseItemVO {
    
    // 课程ID
    private Long id;
    
    // 课程编号
    private Long subjectId;
    
    // 教师ID
    private Long teacherId;
    
    // 教师姓名
    private String teacherName;
    
    // 课程名称
    private String courseName;
    
    // 上课时间
    private Date teachingTime;
    
    // 上课地点
    private String location;
    
    // 星期几 (1-7)
    private Integer dayOfWeek;
    
    // 课程开始时间段 (1-12)
    private Integer startTime;
    
    // 课程结束时间段 (1-12)
    private Integer endTime;
    
    // 班级/年级
    private String grade;
    
    // 专业
    private String major;
    
    // 备注
    private String remarks;
} 