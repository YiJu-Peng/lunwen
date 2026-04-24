package com.hardlin.springbootinit.controller.cloudCalculate;

import cn.dev33.satoken.stp.StpUtil;
import com.hardlin.springbootinit.common.BaseResponse;
import com.hardlin.springbootinit.common.ErrorCode;
import com.hardlin.springbootinit.common.ResultUtils;
import com.hardlin.springbootinit.exception.BusinessException;
import com.hardlin.springbootinit.model.vo.CourseRecommendVO;
import com.hardlin.springbootinit.service.CourseRecommendationService;
import com.hardlin.springbootinit.service.StudentService;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;

/**
 * 课程推荐接口
 *
 * @author DawnCclin
 */
@RestController
@RequestMapping("/api/recommend")
@Slf4j
public class RecommendationController {

    @Resource
    private CourseRecommendationService courseRecommendationService;

    @Resource
    private StudentService studentService;

    /**
     * 获取课程推荐
     *
     * @param userId 用户ID
     * @param limit 推荐数量
     * @param request 请求
     * @return 推荐课程列表
     */
    @GetMapping("/courses")
    public BaseResponse<List<CourseRecommendVO>> getRecommendedCourses(
            @RequestParam("userId") Long userId,
            @RequestParam(value = "limit", required = false) Integer limit,
            HttpServletRequest request) {
        if (userId == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户ID不能为空");
        }

        try {
            // 获取学生ID
            Long studentId = studentService.getStudentIdByUserId(userId);
            if (studentId == null) {
                log.warn("未找到用户ID为 {} 的学生信息", userId);
                return ResultUtils.success(Collections.emptyList());
            }

            // 调用推荐服务
            List<CourseRecommendVO> recommendedCourses = courseRecommendationService.recommendCoursesForStudent(studentId, limit);
            return ResultUtils.success(recommendedCourses);
        } catch (FeignException e) {
            log.error("Feign调用错误，获取推荐课程失败，userId={}, 错误码: {}, 错误信息: {}",
                    userId, e.status(), e.getMessage(), e);
            return ResultUtils.success(Collections.emptyList());
        } catch (Exception e) {
            log.error("获取推荐课程时发生错误，userId={}", userId, e);
            // 返回空列表而不是抛出异常，提高用户体验
            return ResultUtils.success(Collections.emptyList());
        }
    }

    /**
     * 获取当前登录用户的课程推荐
     *
     * @param limit 推荐数量
     * @param request 请求
     * @return 推荐课程列表
     */
    @GetMapping("/myCourses")
    public BaseResponse<List<CourseRecommendVO>> getMyRecommendedCourses(
            @RequestParam(value = "limit", required = false) Integer limit,
            HttpServletRequest request) {
        try {
            // 从请求头获取用户信息
            Object loginIdObj = StpUtil.getLoginId();
            if (loginIdObj == null) {
                throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR, "用户未登录");
            }
            
            // 获取用户ID
            Long userId;
            try {
                userId = Long.valueOf(loginIdObj.toString());
            } catch (NumberFormatException e) {
                log.error("用户ID格式错误: {}", loginIdObj);
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户ID格式错误");
            }
            
            // 获取学生ID
            Long studentId = studentService.getStudentIdByUserId(userId);
            if (studentId == null) {
                log.warn("未找到用户ID为 {} 的学生信息", userId);
                return ResultUtils.success(Collections.emptyList());
            }

            // 调用推荐服务
            List<CourseRecommendVO> recommendedCourses = courseRecommendationService.recommendCoursesForStudent(studentId, limit);
            return ResultUtils.success(recommendedCourses);
        } catch (FeignException e) {
            log.error("Feign调用错误，获取推荐课程失败，错误码: {}, 错误信息: {}",
                    e.status(), e.getMessage(), e);
            return ResultUtils.success(Collections.emptyList());
        } catch (BusinessException e) {
            // 业务异常继续抛出
            throw e;
        } catch (Exception e) {
            log.error("获取当前用户推荐课程时发生错误", e);
            // 返回空列表而不是抛出异常，提高用户体验
            return ResultUtils.success(Collections.emptyList());
        }
    }
} 