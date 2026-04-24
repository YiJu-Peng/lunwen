package com.hardlin.springbootinit.mapper;

import com.hardlin.springbootinit.model.dto.ClassesAvgDTO;
import com.hardlin.springbootinit.model.dto.CourseAverageScoreDTO;
import com.hardlin.springbootinit.model.dto.TeacherCountDTO;
import com.hardlin.springbootinit.model.dto.UsualScoreDTO;
import com.hardlin.springbootinit.model.entity.Score;
import com.hardlin.springbootinit.model.ClassFailCountDTO;
import com.hardlin.springbootinit.model.dto.*;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @author 13179
* @description 针对表【score】的数据库操作Mapper
* @createDate 2024-06-17 22:33:19
* @Entity com.yupi.springbootinit.model.entity.score
*/
public interface ScoreMapper extends BaseMapper<Score> {
    @Select("SELECT teacherName AS name, COUNT(DISTINCT studentId) AS studentCount, AVG(lastScore) AS averageScore " +
            "FROM score WHERE teacherName IS NOT NULL GROUP BY teacherName ")
    List<TeacherCountDTO> analyzeTeacherPerformanceWithAnnotation();
    @Select(""+
            "SELECT " +
            "    CASE " +
            "        WHEN ususalScore < 60 THEN '0-59' " +
            "        WHEN ususalScore BETWEEN 60 AND 74 THEN '60-74' " +
            "        WHEN ususalScore BETWEEN 75 AND 79 THEN '75-79' " +
            "        ELSE '80及以上' " +
            "    END AS scoreRange, " +
            "    COUNT(*) AS totalInRange, " +
            "    SUM(CASE WHEN lastScore < 60 THEN 1 ELSE 0 END) AS failCount, " +
            "    (SUM(CASE WHEN lastScore < 60 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS failRate " +
            "FROM score " +
            "WHERE ususalScore IS NOT NULL AND lastScore IS NOT NULL " +
            "GROUP BY scoreRange " +
            "ORDER BY MIN(ususalScore);")
    List<UsualScoreDTO> getFailRateByUsualScoreRange();

    @Select("SELECT s.subjectName, AVG(sc.lastScore) as averageScore " +
            "FROM score sc " +
            "JOIN subject s ON sc.subjectId = s.Id " +
            "GROUP BY sc.subjectId " +
            "ORDER BY averageScore DESC")
    List<ClassesAvgDTO> getClassSubjectAverageScores();

    @Select("SELECT c.className className, " +
            "       SUM(CASE WHEN s.lastScore < 60 OR s.lastScore IS NULL THEN 1 ELSE 0 END) / COUNT(*) * 100 AS failRatio " +
            "FROM score s " +
            "JOIN (SELECT classId, COUNT(*) AS totalCount FROM score GROUP BY classId) t ON s.classId = t.classId " +
            "JOIN classes c ON s.classId = c.id "+
            "GROUP BY s.classId")
    List<ClassFailCountDTO> getClassFailCounts();

    @Select("SELECT s.subjectName, sc.subjectId, AVG(sc.lastScore) as averageScore " +
            "FROM score sc " +
            "JOIN subject s ON sc.subjectId = s.Id " +
            "GROUP BY sc.subjectId " +
            "ORDER BY averageScore DESC")
    List<CourseAverageScoreDTO> getSubjectAverageScores();
}




