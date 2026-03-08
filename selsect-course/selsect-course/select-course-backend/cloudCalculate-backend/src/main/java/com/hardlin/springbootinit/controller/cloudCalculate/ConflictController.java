package com.hardlin.springbootinit.controller.cloudCalculate;

import cn.dev33.satoken.stp.StpUtil;
import com.hardlin.springbootinit.common.BaseResponse;
import com.hardlin.springbootinit.common.ErrorCode;
import com.hardlin.springbootinit.common.ResultUtils;
import com.hardlin.springbootinit.exception.BusinessException;
import com.hardlin.springbootinit.model.vo.ConflictCheckResult;
import com.hardlin.springbootinit.service.CourseConflictService;
import com.hardlin.springbootinit.service.StudentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * 课程冲突检测接口
 *
 * @author DawnCclin
 */
@RestController
@RequestMapping("/api/conflict")
@Slf4j
public class ConflictController {

    @Resource
    private CourseConflictService courseConflictService;

    @Resource
    private StudentService studentService;

    /**
     * 检查课程时间冲突
     *
     * @param userId 用户ID
     * @param curriculumId 课程ID
     * @param request 请求
     * @return 冲突检测结果
     */
    @GetMapping("/check")
    public BaseResponse<ConflictCheckResult> checkConflict(
            @RequestParam("userId") Long userId,
            @RequestParam("curriculumId") Long curriculumId,
            HttpServletRequest request) {
        if (userId == null || curriculumId == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数不能为空");
        }

        // 获取学生ID
        Long studentId = studentService.getStudentIdByUserId(userId);
        if (studentId == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "未找到对应学生信息");
        }

        // 检查冲突
        ConflictCheckResult result = courseConflictService.checkCourseConflict(studentId, curriculumId);
        return ResultUtils.success(result);
    }

    /**
     * 检查当前登录用户的课程时间冲突
     *
     * @param curriculumId 课程ID
     * @param request 请求
     * @return 冲突检测结果
     */
    @GetMapping("/myCheck")
    public BaseResponse<ConflictCheckResult> checkMyConflict(
            @RequestParam("curriculumId") Long curriculumId,
            HttpServletRequest request) {
        return ResultUtils.success(null);
//        if (curriculumId == null) {
//            throw new BusinessException(ErrorCode.PARAMS_ERROR, "课程ID不能为空");
//        }
//
//
//        // 获取用户ID
//        System.out.println(StpUtil.getLoginId());
//       Long userId = Long.valueOf((String) StpUtil.getLoginId());
//        // 获取学生ID
//        Long studentId = studentService.getStudentIdByUserId(userId);
//        if (studentId == null) {
//            throw new BusinessException(ErrorCode.PARAMS_ERROR, "未找到对应学生信息");
//        }
//
//        // 检查冲突
//        ConflictCheckResult result = courseConflictService.checkCourseConflict(studentId, curriculumId);
//        return ResultUtils.success(result);
    }
} 