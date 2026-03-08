package com.hardlin.springbootinit.service;

import com.hardlin.springbootinit.model.entity.Curriculum;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Optional;

/**
* @author 13179
* @description 针对表【curriculum】的数据库操作Service
* @createDate 2024-11-20 23:04:55
*/
public interface CurriculumService extends IService<Curriculum> {
    List<Curriculum> getAllCurriculums();
    Optional<Curriculum> getCurriculumById(int id);
    Curriculum createCurriculum(Curriculum curriculum);
    Curriculum updateCurriculum(int id, Curriculum curriculum);
    void deleteCurriculum(int id);
    
    /**
     * 获取学生选课的课程列表
     * 
     * @param userId 用户ID
     * @return 学生选择的课程列表
     */
    List<Curriculum> getStudentSelectedCourses(Long userId);
}
