package com.hardlin.springbootinit.service;

import com.hardlin.springbootinit.model.entity.Curriculum;
import com.hardlin.springbootinit.model.vo.ConflictCheckResult;

import java.util.List;

/**
 * 课程冲突检测服务
 *
 * @author DawnCclin
 */
public interface CourseConflictService {
    
    /**
     * 检查课程是否与学生已选课程存在时间冲突
     *
     * @param studentId 学生ID
     * @param curriculumId 待选课程ID
     * @return 冲突检测结果
     */
    ConflictCheckResult checkCourseConflict(Long studentId, Long curriculumId);
    
    /**
     * 获取与指定课程存在时间冲突的已选课程列表
     *
     * @param studentId 学生ID
     * @param curriculum 待选课程
     * @return 冲突课程列表
     */
    List<Curriculum> getConflictCourses(Long studentId, Curriculum curriculum);
    
    /**
     * 判断两个课程是否存在时间冲突
     *
     * @param course1 课程1
     * @param course2 课程2
     * @return 是否存在冲突
     */
    boolean isTimeConflict(Curriculum course1, Curriculum course2);
} 