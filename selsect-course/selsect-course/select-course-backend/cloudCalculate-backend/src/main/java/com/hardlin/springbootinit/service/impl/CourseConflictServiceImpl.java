package com.hardlin.springbootinit.service.impl;

import com.hardlin.springbootinit.mapper.CurriculumMapper;
import com.hardlin.springbootinit.mapper.SubjectMapper;
import com.hardlin.springbootinit.mapper.TeacherMapper;
import com.hardlin.springbootinit.model.dto.EnrollmentDTO;
import com.hardlin.springbootinit.model.entity.Curriculum;
import com.hardlin.springbootinit.model.entity.Subject;
import com.hardlin.springbootinit.model.entity.Teacher;
import com.hardlin.springbootinit.model.vo.ConflictCheckResult;
import com.hardlin.springbootinit.model.vo.ConflictCourseVO;
import com.hardlin.springbootinit.model.vo.CurriculumVO;
import com.hardlin.springbootinit.service.CourseConflictService;
import com.hardlin.springbootinit.service.EnrollmentClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 课程冲突检测服务实现类
 *
 * @author DawnCclin
 */
@Service
@Slf4j
public class CourseConflictServiceImpl implements CourseConflictService {

    @Resource
    private CurriculumMapper curriculumMapper;

    @Resource
    private EnrollmentClient enrollmentClient;

    @Resource
    private SubjectMapper subjectMapper;

    @Resource
    private TeacherMapper teacherMapper;

    // 设置冲突时间阈值为15分钟，即两个课程间隔小于15分钟视为冲突
    private static final long CONFLICT_THRESHOLD_MINUTES = 15;

    @Override
    public ConflictCheckResult checkCourseConflict(Long studentId, Long curriculumId) {
        // 获取待选课程信息
        Curriculum targetCourse = curriculumMapper.selectById(curriculumId);
        if (targetCourse == null) {
            return ConflictCheckResult.noConflict(); // 课程不存在，不存在冲突
        }

        // 获取冲突课程
        List<Curriculum> conflictCourses = getConflictCourses(studentId, targetCourse);
        
        if (conflictCourses.isEmpty()) {
            return ConflictCheckResult.noConflict();
        }
        
        // 创建冲突课程视图对象列表
        List<ConflictCourseVO> conflictCourseVOs = new ArrayList<>();
        for (Curriculum course : conflictCourses) {
            // 获取科目名称
            Subject subject = subjectMapper.selectById(course.getSubjectId());
            String subjectName = subject != null ? subject.getSubjectName() : "未知课程";
            
            // 获取教师名称
            Teacher teacher = teacherMapper.selectById(course.getTeacherId());
            String teacherName = teacher != null ? teacher.getTeacherName() : "未知教师";
            
            // 计算冲突原因
            String conflictReason = calculateConflictReason(targetCourse, course);
            
            // 创建视图对象
            ConflictCourseVO vo = ConflictCourseVO.fromCurriculum(course, subjectName, teacherName, conflictReason);
            conflictCourseVOs.add(vo);
        }
        
        // 创建冲突结果
        String description = String.format("该课程与您已选的%d门课程存在时间冲突", conflictCourseVOs.size());
        return ConflictCheckResult.withConflict(description, conflictCourseVOs, targetCourse);
    }

    @Override
    public List<Curriculum> getConflictCourses(Long studentId, Curriculum curriculum) {
        // 获取学生已选课程
        List<CurriculumVO> enrollments = enrollmentClient.getEnrollmentsByStudentId(studentId);
        if (enrollments == null || enrollments.isEmpty()) {
            return Collections.emptyList();
        }
        
        // 获取已选课程的ID列表
        List<Integer> enrolledCourseIds = new ArrayList<>();
        for (CurriculumVO enrollment : enrollments) {
            enrolledCourseIds.add(enrollment.getSubjectId());
        }
        
        // 查询已选课程信息
        List<Curriculum> enrolledCourses = new ArrayList<>();
        for (Integer courseId : enrolledCourseIds) {
            Curriculum course = curriculumMapper.selectById(courseId);
            if (course != null) {
                enrolledCourses.add(course);
            }
        }
        
        // 检查冲突
        List<Curriculum> conflictCourses = new ArrayList<>();
        for (Curriculum enrolledCourse : enrolledCourses) {
            if (isTimeConflict(curriculum, enrolledCourse)) {
                conflictCourses.add(enrolledCourse);
            }
        }
        
        return conflictCourses;
    }

    @Override
    public boolean isTimeConflict(Curriculum course1, Curriculum course2) {
        // 获取两个课程的上课时间
        Date time1 = course1.getTeachingTime();
        Date time2 = course2.getTeachingTime();
        
        if (time1 == null || time2 == null) {
            return false; // 如果任一课程没有时间信息，认为不冲突
        }
        
        // 假设每节课持续时间为2小时
        long courseDurationMillis = TimeUnit.HOURS.toMillis(2);
        
        // 计算课程的结束时间
        Date endTime1 = new Date(time1.getTime() + courseDurationMillis);
        Date endTime2 = new Date(time2.getTime() + courseDurationMillis);
        
        // 设置冲突阈值(CONFLICT_THRESHOLD_MINUTES分钟)
        long conflictThresholdMillis = TimeUnit.MINUTES.toMillis(CONFLICT_THRESHOLD_MINUTES);
        
        // 减去冲突阈值时间，提前预警冲突
        Date adjustedTime1 = new Date(time1.getTime() - conflictThresholdMillis);
        Date adjustedEndTime1 = new Date(endTime1.getTime() + conflictThresholdMillis);
        
        // 检查时间是否有交叉
        // 课程2的开始时间在课程1的(开始时间-阈值，结束时间+阈值)范围内
        // 或者课程2的结束时间在课程1的(开始时间-阈值，结束时间+阈值)范围内
        boolean timeOverlap = (time2.after(adjustedTime1) && time2.before(adjustedEndTime1)) ||
                             (endTime2.after(adjustedTime1) && endTime2.before(adjustedEndTime1)) ||
                             (time2.before(adjustedTime1) && endTime2.after(adjustedEndTime1));
                             
        return timeOverlap;
    }
    
    /**
     * 计算两个课程的冲突原因
     * 
     * @param targetCourse 目标课程
     * @param enrolledCourse 已选课程
     * @return 冲突原因描述
     */
    private String calculateConflictReason(Curriculum targetCourse, Curriculum enrolledCourse) {
        Date targetTime = targetCourse.getTeachingTime();
        Date enrolledTime = enrolledCourse.getTeachingTime();
        
        // 计算时间差(分钟)
        long diffInMillis = Math.abs(targetTime.getTime() - enrolledTime.getTime());
        long diffMinutes = TimeUnit.MILLISECONDS.toMinutes(diffInMillis);
        
        if (diffMinutes == 0) {
            return "两门课在同一时间开始";
        } else if (diffMinutes <= CONFLICT_THRESHOLD_MINUTES) {
            return String.format("两门课时间相隔仅%d分钟，可能来不及转换教室", diffMinutes);
        } else {
            // 检查一门课是否在另一门课的时间范围内
            // 假设每节课2小时
            long courseDurationMillis = TimeUnit.HOURS.toMillis(2);
            Date targetEndTime = new Date(targetTime.getTime() + courseDurationMillis);
            Date enrolledEndTime = new Date(enrolledTime.getTime() + courseDurationMillis);
            
            if (targetTime.before(enrolledTime) && targetEndTime.after(enrolledTime)) {
                return "待选课程与已选课程时间重叠";
            } else if (enrolledTime.before(targetTime) && enrolledEndTime.after(targetTime)) {
                return "已选课程与待选课程时间重叠";
            } else {
                return "时间接近，可能无法及时到达";
            }
        }
    }
} 