package com.hardlin.springbootinit.mapper;

import com.hardlin.springbootinit.model.entity.Teacher;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
* @author 13179
* @description 针对表【teacher】的数据库操作Mapper
* @createDate 2024-12-01 18:55:18
* @Entity com.hardlin.springbootinit.model.entity.teacher
*/
@Mapper
public interface TeacherMapper extends BaseMapper<Teacher> {

}




