package com.hardlin.springbootinit.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.IService;
import com.hardlin.springbootinit.model.dto.EnrollmentDTO;
import com.hardlin.springbootinit.model.entity.Student;
import com.hardlin.springbootinit.model.entity.User;

import java.util.List;

/**
* @author 13179
* @description 针对表【student】的数据库操作Service
* @createDate 2024-12-02 18:44:49
*/
public interface StudentService extends IService<Student> {

    List<Student> getAllStudents();

    Student getStudentById(Long id);

    Student addStudent(Student student);

    Student updateStudent(Long id, Student studentDetails);

    void deleteStudent(Long id);

    Long getStudentId(Long userId);

    void enrollStudentInCourse(EnrollmentDTO enrollment);

    /**
     * 根据用户ID获取学生ID
     * 
     * @param userId 用户ID
     * @return 学生ID
     */
    Long getStudentIdByUserId(Long userId);
    
    /**
     * 根据用户账号获取用户ID
     * 
     * @param userAccount 用户账号
     * @return 用户ID
     */
    Long getUserIdByAccount(String userAccount);
}
