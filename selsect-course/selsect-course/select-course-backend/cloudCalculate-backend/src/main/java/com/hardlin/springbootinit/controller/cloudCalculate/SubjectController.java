package com.hardlin.springbootinit.controller.cloudCalculate;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.hardlin.springbootinit.common.BaseResponse;
import com.hardlin.springbootinit.common.ErrorCode;
import com.hardlin.springbootinit.common.ResultUtils;
import com.hardlin.springbootinit.model.dto.curriculum.CurriculumRequest;
import com.hardlin.springbootinit.model.entity.Curriculum;
import com.hardlin.springbootinit.model.entity.Student;
import com.hardlin.springbootinit.model.vo.CurriculumVO;
import com.hardlin.springbootinit.service.CurriculumService;
import com.hardlin.springbootinit.service.EnrollmentClient;
import com.hardlin.springbootinit.service.SubjectService;
import com.hardlin.springbootinit.service.TeacherService;
import com.hardlin.springbootinit.utils.BeanMapUtils;
import com.hardlin.springbootinit.utils.PageParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/11/20 23:11
 */
//课程管理
@RestController
@RequestMapping("/subject")
@Slf4j
public class SubjectController {
    //写出curriculum表的增删改查
    @Autowired
    private CurriculumService curriculumService;

    @Autowired
    private SubjectService subjectService;
    @Autowired
    private TeacherService teacherService;
    @Autowired
    private EnrollmentClient enrollmentClient;

    // 查询所有课程
    @GetMapping("/curriculums")
    public List<Curriculum> getAllCurriculums() {
        return curriculumService.getAllCurriculums();
    }
    //筛选查询，包括分页
    @GetMapping("/list")
    public PageParam<CurriculumVO> listCurriculums(CurriculumRequest curriculumRequest) {
        Map params =  BeanMapUtils.beanToMap(curriculumRequest);
        IPage<Curriculum> page = enrollmentClient.page(params);
        //将查出来的数据根据每条的subjectId和teacherId去查subjectName和teacherName然后封装成新的CurriculumVO并返回结果
        List<Curriculum> curriculumList = page.getRecords();
        List<CurriculumVO> curriculumVOList = curriculumList.stream().map(curriculum1 -> {
            CurriculumVO curriculumVO = new CurriculumVO();
            BeanUtils.copyProperties(curriculum1, curriculumVO);
            curriculumVO.setSubjectName(subjectService.getById(curriculum1.getSubjectId()).getSubjectName());
            curriculumVO.setTeacherName(teacherService.getById(curriculum1.getTeacherId()).getTeacherName());
            return curriculumVO;
        }).collect(Collectors.toList());
        PageParam<CurriculumVO> curriculumVOPageParam = new PageParam<>();
        BeanUtils.copyProperties(page,curriculumVOPageParam);
        curriculumVOPageParam.setRecords(curriculumVOList);
        return curriculumVOPageParam;
    }

    // 根据ID查询课程
    @GetMapping("/curriculums/{id}")
    public ResponseEntity<Curriculum> getCurriculumById(@PathVariable int id) {
        Optional<Curriculum> curriculumData = curriculumService.getCurriculumById(id);

        if (curriculumData.isPresent()) {
            return ResponseEntity.ok().body(curriculumData.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 添加新课程
    @PostMapping("/curriculums")
    public Curriculum createCurriculum(@RequestBody Curriculum curriculum) {
        return curriculumService.createCurriculum(curriculum);
    }

    @PostMapping("/curriculums/check")
    public BaseResponse<String> checkCurriculum(Long curriculumId) {
        if (enrollmentClient.checkCurriculum(curriculumId)){
            return ResultUtils.success("审核成功");
        }else {
            return ResultUtils.error(ErrorCode.SYSTEM_ERROR,"审核失败");
        }
    }

    // 更新课程
    @PutMapping("/curriculums/{id}")
    public ResponseEntity<Curriculum> updateCurriculum(@PathVariable int id, @RequestBody Curriculum curriculum) {
        Curriculum updatedCurriculum = curriculumService.updateCurriculum(id, curriculum);
        if (updatedCurriculum != null) {
            return ResponseEntity.ok().body(updatedCurriculum);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 删除课程
    @DeleteMapping("/curriculums/{id}")
    public ResponseEntity<Void> deleteCurriculum(@PathVariable int id) {
        curriculumService.deleteCurriculum(id);
        return ResponseEntity.noContent().build();
    }
}
     