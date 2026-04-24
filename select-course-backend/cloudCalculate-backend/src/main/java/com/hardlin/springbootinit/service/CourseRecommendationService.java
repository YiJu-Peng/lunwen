package com.hardlin.springbootinit.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hardlin.springbootinit.mapper.StudentMapper;
import com.hardlin.springbootinit.mapper.SubjectMapper;
import com.hardlin.springbootinit.model.entity.Curriculum;
import com.hardlin.springbootinit.model.entity.Student;
import com.hardlin.springbootinit.model.entity.Subject;
import com.hardlin.springbootinit.model.vo.CourseRecommendVO;
import com.hardlin.springbootinit.model.vo.CurriculumVO;
import com.hardlin.springbootinit.utils.PageParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 智能课程推荐服务 (简化版 - 使用Feign客户端)
 * 
 * @author DawnCclin
 */
@Service
@Slf4j
public class CourseRecommendationService {

    @Resource
    private StudentMapper studentMapper;

    @Resource
    private SubjectMapper subjectMapper;
    
    @Resource
    private EnrollmentClient enrollmentClient;

    /**
     * 基于学生专业或学院推荐课程 (简化版)
     * 
     * @param studentId 学生ID
     * @param limit 推荐数量
     * @return 推荐课程列表
     */
    public List<CourseRecommendVO> recommendCoursesForStudent(Long studentId, Integer limit) {
        if (limit == null || limit <= 0) {
            limit = 5; // 默认推荐5门课程
        }

        // 获取学生信息
        Student student = studentMapper.selectById(studentId);
        if (student == null) {
            return Collections.emptyList();
        }

        // 推荐结果列表
        List<CourseRecommendVO> result = new ArrayList<>();
        
        try {
            // 使用Feign客户端获取课程数据
            Map<String, Object> params = new HashMap<>();
            
            // 1. 基于学生专业推荐课程
            List<Curriculum> majorCurriculums = new ArrayList<>();
            if (student.getMajor() != null && !student.getMajor().isEmpty()) {
                params.clear();
                params.put("major", student.getMajor());
                params.put("isDelete", 0);
                PageParam<Curriculum> majorPage = enrollmentClient.page(params);
                if (majorPage != null && majorPage.getRecords() != null) {
                    majorCurriculums = majorPage.getRecords();
                }
            }
            
            // 2. 如果专业课程不足，获取其他课程作为补充
            List<Curriculum> otherCurriculums = new ArrayList<>();
            if (majorCurriculums.size() < limit) {
                params.clear();
                params.put("isDelete", 0);
                params.put("current", 1);
                params.put("pageSize", limit - majorCurriculums.size());
                PageParam<Curriculum> otherPage = enrollmentClient.page(params);
                if (otherPage != null && otherPage.getRecords() != null) {
                    otherCurriculums = otherPage.getRecords();
                }
            }
            
            // 3. 构建推荐结果 - 先添加专业课程
            for (Curriculum curriculum : majorCurriculums) {
                Subject subject = subjectMapper.selectById(curriculum.getSubjectId());
                if (subject != null) {
                    CourseRecommendVO recommendVO = new CourseRecommendVO();
                    recommendVO.setCurriculumId(curriculum.getId());
                    recommendVO.setSubjectId(curriculum.getSubjectId());
                    recommendVO.setSubjectName(subject.getSubjectName());
                    recommendVO.setLocation(curriculum.getLocation());
                    recommendVO.setTeachingTime(curriculum.getTeachingTime());
                    recommendVO.setRecommendReason("该课程与你的专业 " + student.getMajor() + " 相关");
                    recommendVO.setRecommendScore(90.0); // 专业课程优先级高
                    
                    result.add(recommendVO);
                }
            }
            
            // 4. 添加其他课程
            for (Curriculum curriculum : otherCurriculums) {
                // 检查是否已经在推荐列表中
                boolean exists = result.stream()
                        .anyMatch(r -> r.getCurriculumId().equals(curriculum.getId()));
                
                if (!exists) {
                    Subject subject = subjectMapper.selectById(curriculum.getSubjectId());
                    if (subject != null) {
                        CourseRecommendVO recommendVO = new CourseRecommendVO();
                        recommendVO.setCurriculumId(curriculum.getId());
                        recommendVO.setSubjectId(curriculum.getSubjectId());
                        recommendVO.setSubjectName(subject.getSubjectName());
                        recommendVO.setLocation(curriculum.getLocation());
                        recommendVO.setTeachingTime(curriculum.getTeachingTime());
                        recommendVO.setRecommendReason("通用选修课程");
                        recommendVO.setRecommendScore(50.0); // 其他课程优先级最低
                        
                        result.add(recommendVO);
                    }
                }
            }
        } catch (Exception e) {
            log.error("通过Feign获取课程数据时出错", e);
            // 发生错误时返回空列表
            return Collections.emptyList();
        }
        
        // 按推荐分数排序
        result.sort(Comparator.comparing(CourseRecommendVO::getRecommendScore).reversed());
        
        // 限制结果数量
        if (result.size() > limit) {
            result = result.subList(0, limit);
        }
        
        return result;
    }
} 