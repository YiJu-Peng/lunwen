package com.hardlin.springbootinit.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.hardlin.springbootinit.common.BaseResponse;
import com.hardlin.springbootinit.common.ErrorCode;
import com.hardlin.springbootinit.common.ResultUtils;
import com.hardlin.springbootinit.model.dto.EnrollmentDTO;
import com.hardlin.springbootinit.model.dto.curriculum.CurriculumRequest;
import com.hardlin.springbootinit.model.entity.Curriculum;
import com.hardlin.springbootinit.model.entity.Subject;
import com.hardlin.springbootinit.model.entity.Teacher;
import com.hardlin.springbootinit.model.vo.CurriculumVO;
import com.hardlin.springbootinit.service.*;
import com.hardlin.springbootinit.utils.BeanMapUtils;
import com.hardlin.springbootinit.utils.IdGenerator;
import com.hardlin.springbootinit.utils.PageParam;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/2 15:49
 */
@RestController
@RequestMapping("/main")
public class SelectCourseController {

    @Autowired
    private EnrollmentClient enrollmentClient;
    @Autowired
    private SubjectService subjectService;
    @Autowired
    private StudentService studentService;
    @Autowired
    private TeacherService teacherService;

    @GetMapping("/test")
    public String getAllCourses() {
        return enrollmentClient.test();
    }

    @GetMapping("/page")
    public PageParam<CurriculumVO> pageCurriculums(CurriculumRequest curriculumRequest) {
        try {
            Map params = BeanMapUtils.beanToMap(curriculumRequest);
            IPage<Curriculum> page = enrollmentClient.page(params);
            
            // 将查出来的数据根据每条的subjectId和teacherId去查subjectName和teacherName然后封装成新的CurriculumVO并返回结果
            List<Curriculum> curriculumList = page.getRecords();
            List<CurriculumVO> curriculumVOList = curriculumList.stream().map(curriculum1 -> {
                CurriculumVO curriculumVO = new CurriculumVO();
                
                // 防止curriculum1为null
                if (curriculum1 == null) {
                    return curriculumVO;
                }
                
                BeanUtils.copyProperties(curriculum1, curriculumVO);
                
                // 添加空指针检查
                if (curriculum1.getSubjectId() != null) {
                    try {
                        Subject subject = subjectService.getById(curriculum1.getSubjectId());
                        if (subject != null) {
                            curriculumVO.setSubjectName(subject.getSubjectName());
                        } else {
                            curriculumVO.setSubjectName("未知课程");
                        }
                    } catch (Exception e) {
                        // 处理查询异常
                        curriculumVO.setSubjectName("未知课程");
                    }
                } else {
                    curriculumVO.setSubjectName("未知课程");
                }
                
                // 添加空指针检查
                if (curriculum1.getTeacherId() != null) {
                    try {
                        // 使用增强的查询方法，同时查询id和teacherId
                        Teacher teacher = teacherService.getByTeacherId(curriculum1.getTeacherId());
                        if (teacher != null) {
                            curriculumVO.setTeacherName(teacher.getTeacherName());
                        } else {
                            curriculumVO.setTeacherName("未知教师");
                        }
                    } catch (Exception e) {
                        // 处理查询异常
                        curriculumVO.setTeacherName("未知教师");
                    }
                } else {
                    curriculumVO.setTeacherName("未知教师");
                }
                
                return curriculumVO;
            }).collect(Collectors.toList());
            
            PageParam<CurriculumVO> curriculumVOPageParam = new PageParam<>();
            BeanUtils.copyProperties(page, curriculumVOPageParam);
            curriculumVOPageParam.setRecords(curriculumVOList);
            return curriculumVOPageParam;
        } catch (Exception e) {
            // 异常处理，记录日志并返回空页
            e.printStackTrace();
            PageParam<CurriculumVO> errorPage = new PageParam<>();
            errorPage.setRecords(new ArrayList<>());
            errorPage.setCurrent(1);
            errorPage.setSize(10);
            errorPage.setTotal(0);
            return errorPage;
        }
    }

    @PostMapping("/select")
    public BaseResponse selectCourse(EnrollmentDTO enrollmentDTO) {
//        Long studentId = studentService.getStudentId(userId);
//        //生成一个16位随机流水号
//        Long requestId = IdGenerator.generateRandomNumber(16);
//        if (studentId != null){
//            String string = enrollmentClient.enrollStudentToCourse(studentId, curriculumId, requestId);
//            if (string.contains("成功")){
//                return ResultUtils.success(string);
//            }else {
//                return ResultUtils.error(ErrorCode.SYSTEM_ERROR,string);
//            }
//        }
//        return ResultUtils.error(ErrorCode.SYSTEM_ERROR,"选课失败");
        studentService.enrollStudentInCourse(enrollmentDTO);
        return ResultUtils.success("正在选课中，选课结果将稍后(0-5min)通知。");
    }

    @PostMapping("/drop")
    public boolean dropCourse(Long studentId, Long courseId) {
        return enrollmentClient.dropCourse(studentId, courseId);
    }

    @GetMapping("/search")
    public List<CurriculumVO> getStudentEnrollments(Long studentId) {
        List<CurriculumVO> enrollments = enrollmentClient.getEnrollmentsByStudentId(studentId);
        
        // 填充科目名称和教师名称
        if (enrollments != null) {
            for (CurriculumVO curriculum : enrollments) {
                // 添加空指针检查
                if (curriculum.getSubjectId() != null) {
                    try {
                        Subject subject = subjectService.getById(curriculum.getSubjectId());
                        if (subject != null) {
                            curriculum.setSubjectName(subject.getSubjectName());
                        } else {
                            curriculum.setSubjectName("课程" + curriculum.getSubjectId());
                        }
                    } catch (Exception e) {
                        // 处理查询异常
                        curriculum.setSubjectName("课程" + curriculum.getSubjectId());
                    }
                }
                
                // 添加空指针检查
                if (curriculum.getTeacherId() != null) {
                    try {
                        // 使用增强的查询方法查询教师信息
                        Teacher teacher = teacherService.getByTeacherId(curriculum.getTeacherId());
                        if (teacher != null) {
                            curriculum.setTeacherName(teacher.getTeacherName());
                        } else {
                            curriculum.setTeacherName("教师" + curriculum.getTeacherId());
                        }
                    } catch (Exception e) {
                        // 处理查询异常
                        curriculum.setTeacherName("教师" + curriculum.getTeacherId());
                    }
                }
            }
        }
        
        return enrollments;
    }


}
     