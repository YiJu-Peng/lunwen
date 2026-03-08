package com.hardlin.selectcourse.service.serviceimpl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hardlin.selectcourse.entity.Curriculum;
import com.hardlin.selectcourse.entity.Enrollment;
import com.hardlin.selectcourse.entity.ScheduleCourseItemVO;
import com.hardlin.selectcourse.mapper.CurriculumMapper;
import com.hardlin.selectcourse.mapper.EnrollmentMapper;
import com.hardlin.selectcourse.service.ScheduleService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 课程表服务实现类
 */
@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private EnrollmentMapper enrollmentMapper;

    @Autowired
    private CurriculumMapper curriculumMapper;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<ScheduleCourseItemVO> getStudentSchedule(Long studentId) {
        // 1. 查询学生的所有选课记录
        LambdaQueryWrapper<Enrollment> enrollmentQuery = new LambdaQueryWrapper<>();
        enrollmentQuery.eq(Enrollment::getStudentId, studentId);
        List<Enrollment> enrollments = enrollmentMapper.selectList(enrollmentQuery);
        
        if (enrollments == null || enrollments.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 2. 获取所有课程ID
        List<Long> curriculumIds = enrollments.stream()
                .map(Enrollment::getCurriculumId)
                .collect(Collectors.toList());
        
        // 3. 查询课程详情
        LambdaQueryWrapper<Curriculum> curriculumQuery = new LambdaQueryWrapper<>();
        curriculumQuery.in(Curriculum::getId, curriculumIds);
        List<Curriculum> curriculums = curriculumMapper.selectList(curriculumQuery);
        
        // 4. 填充课程名称和教师名称
        fillCourseAndTeacherNames(curriculums);
        
        // 5. 转换为VO对象
        return convertToScheduleVO(curriculums);
    }

    @Override
    public List<ScheduleCourseItemVO> getCurrentWeekSchedule(Long studentId) {
        // 获取所有课程
        return getStudentSchedule(studentId);
        
        // 注意：以前的实现是基于teachingTime日期过滤当前周的课程
        // 现在的实现直接返回所有课程，因为我们使用dayOfWeek来确定周几
        // 如果需要根据学期或其他日期范围筛选，可以在这里添加相应的逻辑
    }
    
    /**
     * 填充课程名称和教师名称
     */
    private void fillCourseAndTeacherNames(List<Curriculum> curriculums) {
        if (curriculums == null || curriculums.isEmpty()) {
            return;
        }
        
        // 收集所有需要查询的ID
        List<Long> subjectIds = curriculums.stream()
                .map(Curriculum::getSubjectId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());
                
        List<Long> teacherIds = curriculums.stream()
                .map(Curriculum::getTeacherId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());
        
        // 如果没有ID需要查询，直接返回
        if (subjectIds.isEmpty() && teacherIds.isEmpty()) {
            return;
        }
        
        // 查询科目名称
        Map<Long, String> subjectMap = new java.util.HashMap<>();
        if (!subjectIds.isEmpty()) {
            try {
                String subjectIdsStr = subjectIds.stream()
                        .map(String::valueOf)
                        .collect(Collectors.joining(","));
                
                String subjectQuery = "SELECT id, subject_name FROM subject WHERE id IN (" + subjectIdsStr + ")";
                List<Map<String, Object>> subjectResults = jdbcTemplate.queryForList(subjectQuery);
                
                for (Map<String, Object> row : subjectResults) {
                    Long id = ((Number) row.get("id")).longValue();
                    String name = (String) row.get("subject_name");
                    subjectMap.put(id, name);
                }
            } catch (Exception e) {
                // 记录错误但继续执行
                e.printStackTrace();
            }
        }
        
        // 查询教师名称
        Map<Long, String> teacherMap = new java.util.HashMap<>();
        if (!teacherIds.isEmpty()) {
            try {
                String teacherIdsStr = teacherIds.stream()
                        .map(String::valueOf)
                        .collect(Collectors.joining(","));
                
                String teacherQuery = "SELECT id, teacher_name FROM teacher WHERE id IN (" + teacherIdsStr + ")";
                List<Map<String, Object>> teacherResults = jdbcTemplate.queryForList(teacherQuery);
                
                for (Map<String, Object> row : teacherResults) {
                    Long id = ((Number) row.get("id")).longValue();
                    String name = (String) row.get("teacher_name");
                    teacherMap.put(id, name);
                }
            } catch (Exception e) {
                // 记录错误但继续执行
                e.printStackTrace();
            }
        }
        
        // 填充名称到课程对象
        for (Curriculum curriculum : curriculums) {
            // 设置课程名称
            if (curriculum.getSubjectId() != null) {
                String subjectName = subjectMap.get(curriculum.getSubjectId());
                if (subjectName != null) {
                    curriculum.setSubjectName(subjectName);
                } else {
                    curriculum.setSubjectName("课程" + curriculum.getSubjectId());
                }
            }
            
            // 设置教师名称
            if (curriculum.getTeacherId() != null) {
                String teacherName = teacherMap.get(curriculum.getTeacherId());
                if (teacherName != null) {
                    curriculum.setTeacherName(teacherName);
                } else {
                    curriculum.setTeacherName("教师" + curriculum.getTeacherId());
                }
            }
        }
    }
    
    /**
     * 将课程信息转换为课程表VO
     */
    private List<ScheduleCourseItemVO> convertToScheduleVO(List<Curriculum> curriculums) {
        List<ScheduleCourseItemVO> result = new ArrayList<>();
        
        for (Curriculum curriculum : curriculums) {
            ScheduleCourseItemVO vo = new ScheduleCourseItemVO();
            
            // 复制基本属性
            BeanUtils.copyProperties(curriculum, vo);
            
            // 设置课程名称（使用科目名称）
            vo.setCourseName(curriculum.getSubjectName());
            
            // 课程位置和时间信息直接使用数据库中的dayOfWeek, startTime和endTime
            // 如果数据库中没有这些值，则使用默认逻辑分配
            if (vo.getDayOfWeek() == null) {
                // 使用ID分配一个周几 (1-5，周一到周五)
                int id = curriculum.getId() != null ? curriculum.getId().intValue() : 0;
                vo.setDayOfWeek((id % 5) + 1);
            }
            
            if (vo.getStartTime() == null || vo.getEndTime() == null) {
                // 使用ID分配时间段
                int id = curriculum.getId() != null ? curriculum.getId().intValue() : 0;
                int timeSlot = id % 3;
                switch (timeSlot) {
                    case 0: // 上午
                        vo.setStartTime(1);
                        vo.setEndTime(2);
                        break;
                    case 1: // 下午
                        vo.setStartTime(3);
                        vo.setEndTime(4);
                        break;
                    default: // 晚上
                        vo.setStartTime(5);
                        vo.setEndTime(6);
                        break;
                }
            }
            
            result.add(vo);
        }
        
        return result;
    }
} 