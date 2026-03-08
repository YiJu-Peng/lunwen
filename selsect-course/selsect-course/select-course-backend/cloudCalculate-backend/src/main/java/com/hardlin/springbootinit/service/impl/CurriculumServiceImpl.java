package com.hardlin.springbootinit.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hardlin.springbootinit.model.entity.Curriculum;
import com.hardlin.springbootinit.service.CurriculumService;
import com.hardlin.springbootinit.mapper.CurriculumMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
* @author 13179
* @description 针对表【curriculum】的数据库操作Service实现
* @createDate 2024-11-20 23:04:55
*/
@Service
public class CurriculumServiceImpl extends ServiceImpl<CurriculumMapper, Curriculum>
    implements CurriculumService {
     @Autowired
    private CurriculumMapper curriculumMapper;

    @Override
    public List<Curriculum> getAllCurriculums() {
        return curriculumMapper.getAllCurriculums();
    }

    @Override
    public Optional<Curriculum> getCurriculumById(int id) {
        return curriculumMapper.getCurriculumById(id);
    }

    @Override
    public Curriculum createCurriculum(Curriculum curriculum) {
        return curriculumMapper.createCurriculum(curriculum);
    }

    @Override
    public Curriculum updateCurriculum(int id, Curriculum curriculum) {
        return curriculumMapper.updateCurriculum(id, curriculum);
    }

    @Override
    public void deleteCurriculum(int id) {
        curriculumMapper.deleteCurriculum(id);
    }
    
    @Override
    public List<Curriculum> getStudentSelectedCourses(Long userId) {
        // 实际的实现应该查询选课表和课程表的关联数据
        // 这里简化处理，直接返回所有课程作为示例
        // 在实际项目中，应根据数据库模型和业务逻辑进行修改
        return list();
    }
}




