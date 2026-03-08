package com.hardlin.springbootinit.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 课程表视图对象
 *
 * @author DawnCclin
 */
@Data
public class ScheduleVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 对应的学生/教师ID
     */
    private Long personId;

    /**
     * 姓名
     */
    private String name;

    /**
     * 用户类型（学生/教师）
     */
    private String userType;

    /**
     * 课程表类型（周课表/学期课表）
     */
    private String scheduleType;

    /**
     * 当前周次/学期信息
     */
    private String currentPeriod;

    /**
     * 课程表数据
     * 外层Map的键是星期几（1-7），值是当天的课程列表
     */
    private Map<Integer, List<ScheduleCourseItemVO>> scheduleData;

    /**
     * 所有课程的列表
     */
    private List<ScheduleCourseItemVO> courseList;
} 