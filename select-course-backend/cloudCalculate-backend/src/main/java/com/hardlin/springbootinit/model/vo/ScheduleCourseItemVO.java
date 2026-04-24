package com.hardlin.springbootinit.model.vo;

import lombok.Data;
import java.io.Serializable;

/**
 * 课程表项目视图对象
 *
 * @author DawnCclin
 */
@Data
public class ScheduleCourseItemVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 课程ID
     */
    private Long curriculumId;

    /**
     * 课程名称
     */
    private String subjectName;

    /**
     * 教师姓名
     */
    private String teacherName;

    /**
     * 教师ID
     */
    private Long teacherId;

    /**
     * 上课地点
     */
    private String location;

    /**
     * 上课时间
     */
    private String teachingTime;

    /**
     * 课程开始时间（小时）
     */
    private Integer startHour;

    /**
     * 课程开始时间（分钟）
     */
    private Integer startMinute;

    /**
     * 课程结束时间（小时）
     */
    private Integer endHour;

    /**
     * 课程结束时间（分钟）
     */
    private Integer endMinute;

    /**
     * 星期几（1-7）
     */
    private Integer dayOfWeek;

    /**
     * 课程所在周次列表
     */
    private String weeks;

    /**
     * 课程颜色（前端显示用）
     */
    private String color;
} 