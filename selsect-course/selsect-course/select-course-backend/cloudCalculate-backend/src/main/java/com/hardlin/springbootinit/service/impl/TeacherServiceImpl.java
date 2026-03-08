package com.hardlin.springbootinit.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hardlin.springbootinit.model.entity.Teacher;
import com.hardlin.springbootinit.service.TeacherService;
import com.hardlin.springbootinit.mapper.TeacherMapper;
import org.springframework.stereotype.Service;

/**
* @author 13179
* @description 针对表【teacher】的数据库操作Service实现
* @createDate 2024-12-01 18:55:18
*/
@Service
public class TeacherServiceImpl extends ServiceImpl<TeacherMapper, Teacher>
    implements TeacherService {
    
    @Override
    public Teacher getByTeacherId(Integer teacherId) {
        // 使用teacherId或id查询，增加容错能力
        LambdaQueryWrapper<Teacher> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Teacher::getTeacherId, teacherId.longValue())
                .or()
                .eq(Teacher::getId, teacherId);
        return getOne(queryWrapper);
    }
}




