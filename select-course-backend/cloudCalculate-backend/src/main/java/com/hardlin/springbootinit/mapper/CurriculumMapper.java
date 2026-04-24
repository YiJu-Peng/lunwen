package com.hardlin.springbootinit.mapper;

import com.hardlin.springbootinit.model.entity.Curriculum;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

/**
* @author 13179
* @description 针对表【curriculum】的数据库操作Mapper
* @createDate 2024-11-20 23:04:54
* @Entity com.hardlin.springbootinit.model.entity.curriculum
*/
public interface CurriculumMapper extends BaseMapper<Curriculum> {
    @Select("SELECT * FROM curriculum")
    List<Curriculum> getAllCurriculums();

    @Select("SELECT * FROM curriculum WHERE id = #{id}")
    Optional<Curriculum> getCurriculumById(int id);

    @Insert("INSERT INTO curriculum (subjectId, teacherId, teachingTime, location, remarks) VALUES (#{subjectId}, #{teacherId}, #{teachingTime}, #{location}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    Curriculum createCurriculum(Curriculum curriculum);

    @Update("UPDATE curriculum SET subjectId = #{subjectId}, teacherId = #{teacherId}, teachingTime = #{teachingTime}, location = #{location}, remarks = #{remarks} WHERE id = #{id}")
    Curriculum updateCurriculum(int id, Curriculum curriculum);

    @Delete("DELETE FROM curriculum WHERE id = #{id}")
    void deleteCurriculum(int id);
}




