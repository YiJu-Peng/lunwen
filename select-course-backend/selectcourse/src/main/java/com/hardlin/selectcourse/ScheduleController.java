package com.hardlin.selectcourse;

import com.hardlin.selectcourse.entity.ScheduleCourseItemVO;
import com.hardlin.selectcourse.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 对外提供课表相关接口的入口类
 */
@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    /**
     * 获取学生的课程表
     * @param studentId 学生ID
     * @return 课程表项列表
     */
    @GetMapping("/student/{studentId}")
    public List<ScheduleCourseItemVO> getStudentSchedule(@PathVariable Long studentId) {
        return scheduleService.getStudentSchedule(studentId);
    }
    
    /**
     * 获取学生当前周课程表
     * @param studentId 学生ID
     * @return 当前周课程表项列表
     */
    @GetMapping("/student/{studentId}/current-week")
    public List<ScheduleCourseItemVO> getCurrentWeekSchedule(@PathVariable Long studentId) {
        return scheduleService.getCurrentWeekSchedule(studentId);
    }
} 