package com.hardlin.springbootinit.model.vo;

import com.hardlin.springbootinit.model.entity.Curriculum;
import lombok.Data;

import java.util.List;

/**
 * 课程冲突检测结果视图对象
 *
 * @author DawnCclin
 */
@Data
public class ConflictCheckResult {
    
    /**
     * 是否存在冲突
     */
    private boolean hasConflict;
    
    /**
     * 冲突描述
     */
    private String conflictDescription;
    
    /**
     * 冲突课程列表
     */
    private List<ConflictCourseVO> conflictCourses;
    
    /**
     * 冲突详情
     */
    private String conflictDetails;
    
    /**
     * 待选课程
     */
    private Curriculum targetCourse;
    
    /**
     * 创建一个无冲突结果
     * 
     * @return 无冲突结果
     */
    public static ConflictCheckResult noConflict() {
        ConflictCheckResult result = new ConflictCheckResult();
        result.setHasConflict(false);
        result.setConflictDescription("没有检测到课程时间冲突");
        return result;
    }
    
    /**
     * 创建一个有冲突结果
     * 
     * @param description 冲突描述
     * @param conflictCourses 冲突课程列表
     * @param targetCourse 待选课程
     * @return 有冲突结果
     */
    public static ConflictCheckResult withConflict(String description, List<ConflictCourseVO> conflictCourses, Curriculum targetCourse) {
        ConflictCheckResult result = new ConflictCheckResult();
        result.setHasConflict(true);
        result.setConflictDescription(description);
        result.setConflictCourses(conflictCourses);
        result.setTargetCourse(targetCourse);
        
        // 生成详细冲突信息
        StringBuilder details = new StringBuilder();
        details.append("待选课程 [").append(targetCourse.getSubjectId()).append("] ");
        details.append("与以下已选课程存在时间冲突:\n");
        
        for (ConflictCourseVO course : conflictCourses) {
            details.append("- ").append(course.getSubjectName())
                    .append(" (").append(course.getTeachingTimeString()).append(")");
            details.append(" 冲突原因: ").append(course.getConflictReason()).append("\n");
        }
        
        result.setConflictDetails(details.toString());
        return result;
    }
} 