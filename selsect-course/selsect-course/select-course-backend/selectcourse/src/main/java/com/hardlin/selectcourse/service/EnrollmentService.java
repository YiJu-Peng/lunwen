package com.hardlin.selectcourse.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.hardlin.selectcourse.entity.Curriculum;
import com.hardlin.selectcourse.entity.Enrollment;
import com.hardlin.selectcourse.entity.EnrollmentLog;

import java.util.List;

/**
 * @author 13179
 * @description 针对表【enrollment】的数据库操作Service
 * @createDate 2024-12-03 20:49:04
 */
public interface EnrollmentService extends IService<Enrollment> {

    String enrollStudentToCourse(Long studentId, Curriculum curriculum, EnrollmentLog enrollmentLog);

    List<Enrollment> getEnrollmentsByStudentId(String studentId);

    boolean dropCourse(String studentId, Long courseId);

}
