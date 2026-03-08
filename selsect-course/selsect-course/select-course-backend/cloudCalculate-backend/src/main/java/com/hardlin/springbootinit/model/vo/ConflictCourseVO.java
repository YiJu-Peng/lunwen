package com.hardlin.springbootinit.model.vo;

import com.hardlin.springbootinit.model.entity.Curriculum;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 冲突课程视图对象
 *
 * @author DawnCclin
 */
@Data
public class ConflictCourseVO {
    
    /**
     * 课程ID
     */
    private Integer curriculumId;
    
    /**
     * 科目ID
     */
    private Integer subjectId;
    
    /**
     * 科目名称
     */
    private String subjectName;
    
    /**
     * 上课时间
     */
    private Date teachingTime;
    
    /**
     * 上课地点
     */
    private String location;
    
    /**
     * 教师ID
     */
    private Integer teacherId;
    
    /**
     * 教师名称
     */
    private String teacherName;
    
    /**
     * 冲突原因
     */
    private String conflictReason;
    
    /**
     * 获取格式化的上课时间字符串
     * 
     * @return 格式化的时间字符串
     */
    public String getTeachingTimeString() {
        if (teachingTime == null) {
            return "时间未设置";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        return sdf.format(teachingTime);
    }
    
    /**
     * 根据课程和冲突原因创建冲突课程视图对象
     * 
     * @param curriculum 课程
     * @param subjectName 科目名称
     * @param teacherName 教师名称
     * @param conflictReason 冲突原因
     * @return 冲突课程视图对象
     */
    public static ConflictCourseVO fromCurriculum(Curriculum curriculum, String subjectName, 
                                                 String teacherName, String conflictReason) {
        ConflictCourseVO vo = new ConflictCourseVO();
        vo.setCurriculumId(curriculum.getId());
        vo.setSubjectId(curriculum.getSubjectId());
        vo.setSubjectName(subjectName);
        vo.setTeachingTime(curriculum.getTeachingTime());
        vo.setLocation(curriculum.getLocation());
        vo.setTeacherId(curriculum.getTeacherId());
        vo.setTeacherName(teacherName);
        vo.setConflictReason(conflictReason);
        return vo;
    }
} 