package com.hardlin.springbootinit.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hardlin.springbootinit.config.RabbitConfig;
import com.hardlin.springbootinit.model.dto.EnrollmentDTO;
import com.hardlin.springbootinit.model.entity.Student;
import com.hardlin.springbootinit.service.StudentService;
import com.hardlin.springbootinit.mapper.StudentMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.hardlin.springbootinit.mapper.UserMapper;
import com.hardlin.springbootinit.model.entity.User;

import java.util.List;

/**
* @author 13179
* @description 针对表【student】的数据库操作Service实现
* @createDate 2024-12-02 18:44:49
*/
@Service
public class StudentServiceImpl extends ServiceImpl<StudentMapper, Student>
    implements StudentService {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<Student> getAllStudents() {
        //获取所有的学生信息
        return null;
    }

    @Override
    public Student getStudentById(Long id) {
        return null;
    }

    @Override
    public Student addStudent(Student student) {
        return null;
    }

    @Override
    public Student updateStudent(Long id, Student studentDetails) {
        return null;
    }

    @Override
    public void deleteStudent(Long id) {

    }

    @Override
    public Long getStudentId(Long userId) {
        Student student = this.getOne(new LambdaQueryWrapper<Student>().eq(Student::getUserId, userId));
        if (student != null){
            return student.getStudentId();
        }else return null;
    }

    @Override
    public void enrollStudentInCourse(EnrollmentDTO enrollment) {
        // 发送消息到RabbitMQ
        rabbitTemplate.convertAndSend(RabbitConfig.QUEUE_NAME, enrollment);
    }

    /**
     * 根据用户ID获取学生ID
     */
    @Override
    public Long getStudentIdByUserId(Long userId) {
        if (userId == null) {
            return null;
        }
        Student student = this.getOne(
                new LambdaQueryWrapper<Student>()
                        .eq(Student::getUserId, userId)
        );
        return Long.valueOf(student != null ? student.getId() : null);
    }
    
    /**
     * 根据用户账号获取用户ID
     */
    @Override
    public Long getUserIdByAccount(String userAccount) {
        if (userAccount == null) {
            return null;
        }
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUserAccount, userAccount)
        );
        return user != null ? user.getId() : null;
    }
}




