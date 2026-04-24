package com.hardlin.selectcourse.service.serviceimpl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hardlin.selectcourse.entity.Curriculum;
import com.hardlin.selectcourse.entity.Enrollment;
import com.hardlin.selectcourse.entity.EnrollmentLog;
import com.hardlin.selectcourse.service.CurriculumService;
import com.hardlin.selectcourse.service.EnrollmentLogService;
import com.hardlin.selectcourse.service.EnrollmentService;
import com.hardlin.selectcourse.mapper.EnrollmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
* @author 13179
* @description 针对表【enrollment】的数据库操作Service实现
* @createDate 2024-12-03 20:49:04
*/
@Service
public class EnrollmentServiceImpl extends ServiceImpl<EnrollmentMapper, Enrollment>
    implements EnrollmentService{

    @Autowired
    private CurriculumService curriculumService;
    @Autowired
    private EnrollmentLogService enrollmentLogService;
    
    @Override
    @Transactional
    public String enrollStudentToCourse(Long studentId, Curriculum curriculum, EnrollmentLog enrollmentLog) {
        //扣减库存
        try {
            curriculum.setStock(curriculum.getStock()-1);
            curriculumService.updateById(curriculum);
            //向数据库中插入选课数据
            Enrollment enrollment = new Enrollment();
            enrollment.setStudentId(studentId);
            enrollment.setCurriculumId(curriculum.getId());
            this.save(enrollment);
            enrollmentLog.setStatus(1);
            enrollmentLogService.updateById(enrollmentLog);
            return "选课成功";
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Enrollment> getEnrollmentsByStudentId(String studentId) {
        // 根据学生ID查询所有选课记录
        LambdaQueryWrapper<Enrollment> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Enrollment::getStudentId, Long.parseLong(studentId));
        return this.list(queryWrapper);
    }

    @Override
    @Transactional
    public boolean dropCourse(String studentId, Long courseId) {
        try {
            // 1. 查询选课记录
            LambdaQueryWrapper<Enrollment> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Enrollment::getStudentId, Long.parseLong(studentId))
                    .eq(Enrollment::getCurriculumId, courseId);
            Enrollment enrollment = this.getOne(queryWrapper);
            
            if (enrollment == null) {
                return false; // 没有找到选课记录
            }
            
            // 2. 恢复课程库存
            Curriculum curriculum = curriculumService.getById(courseId);
            if (curriculum != null) {
                curriculum.setStock(curriculum.getStock() + 1);
                curriculumService.updateById(curriculum);
            }
            
            // 3. 删除选课记录
            return this.remove(queryWrapper);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}




