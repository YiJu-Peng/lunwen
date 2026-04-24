package com.hardlin.selectcourse.service;

import com.hardlin.selectcourse.entity.ScheduleCourseItemVO;
import java.util.List;

/**
 * 课程表服务接口
 */
public interface ScheduleService {

    /**
     * 获取学生的全部课程表
     * @param studentId 学生ID
     * @return 课程表项列表
     */
    List<ScheduleCourseItemVO> getStudentSchedule(Long studentId);

    /**
     * 获取学生当前周的课程表
     * @param studentId 学生ID
     * @return 当前周课程表项列表
     */
    List<ScheduleCourseItemVO> getCurrentWeekSchedule(Long studentId);
} 