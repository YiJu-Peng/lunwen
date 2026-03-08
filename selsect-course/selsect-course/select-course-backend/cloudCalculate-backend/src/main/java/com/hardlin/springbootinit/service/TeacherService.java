package com.hardlin.springbootinit.service;

import com.hardlin.springbootinit.model.entity.Teacher;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author 13179
* @description 针对表【teacher】的数据库操作Service
* @createDate 2024-12-01 18:55:18
*/
public interface TeacherService extends IService<Teacher> {
    
    /**
     * 根据teacherId字段查询教师信息
     * @param teacherId 教师ID
     * @return 教师信息
     */
    Teacher getByTeacherId(Integer teacherId);
}
