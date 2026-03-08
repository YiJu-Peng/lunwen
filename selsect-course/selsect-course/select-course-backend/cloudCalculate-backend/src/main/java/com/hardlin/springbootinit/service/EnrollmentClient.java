package com.hardlin.springbootinit.service;

import com.hardlin.springbootinit.model.entity.Curriculum;
import com.hardlin.springbootinit.model.vo.CurriculumVO;
import com.hardlin.springbootinit.utils.PageParam;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/2 15:48
 */
@FeignClient(name = "enrollment-service")
public interface EnrollmentClient {

    @GetMapping("/api/enrollments/test")
    String test();

    @PostMapping("/api/enrollments/select")
    String enrollStudentToCourse(@RequestParam Long studentId, @RequestParam Long curriculumId,@RequestParam Long requestId);

    @PostMapping("/api/enrollments/drop")
    boolean dropCourse(@RequestParam Long studentId,@RequestParam Long courseId);

    @GetMapping("/api/enrollments/student")
    List<CurriculumVO> getEnrollmentsByStudentId(@RequestParam Long studentId);

    @GetMapping("/api/enrollments/page")
    PageParam<Curriculum> page(@RequestParam Map<String, Object> params);

    @PostMapping("/api/enrollments/check")
    boolean checkCurriculum(Long curriculumId);
}