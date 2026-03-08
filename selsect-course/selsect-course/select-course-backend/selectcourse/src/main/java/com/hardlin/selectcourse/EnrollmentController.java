package com.hardlin.selectcourse;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.hardlin.selectcourse.condition.CurriculumQueryCondition;
import com.hardlin.selectcourse.entity.Curriculum;
import com.hardlin.selectcourse.entity.CurriculumPageRequest;
import com.hardlin.selectcourse.entity.Enrollment;
import com.hardlin.selectcourse.entity.EnrollmentLog;
import com.hardlin.selectcourse.service.CurriculumService;
import com.hardlin.selectcourse.service.EnrollmentLogService;
import com.hardlin.selectcourse.service.EnrollmentService;
import com.hardlin.selectcourse.util.PageParam;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/2 13:42
 */
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;
    @Autowired
    private EnrollmentLogService enrollmentLogService;
    @Autowired
    private RedissonClient redissonClient;
    @Autowired
    private CurriculumService curriculumService;

    @GetMapping("/test")
    public String test() {
        return "测试测试重生";
    }

    /**
     * 获取学生已选课程列表
     * @param studentId 学生ID
     * @return 已选课程列表，包含课程详情
     */
    @GetMapping("/student")
    public ResponseEntity<List<Curriculum>> getEnrollmentsByStudentId(String studentId) {
        try {
            // 获取学生的所有选课记录
            List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudentId(studentId);
            
            if (enrollments == null || enrollments.isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>());
            }
            
            // 提取课程ID列表
            List<Long> curriculumIds = enrollments.stream()
                    .map(Enrollment::getCurriculumId)
                    .collect(Collectors.toList());
            
            // 查询对应的课程详情
            LambdaQueryWrapper<Curriculum> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.in(Curriculum::getId, curriculumIds);
            List<Curriculum> curriculums = curriculumService.list(queryWrapper);
            
            return ResponseEntity.ok(curriculums);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/page")
    public IPage<Curriculum> getCurriculumPage(CurriculumPageRequest currentPageRequest) {
        IPage<Curriculum> page = curriculumService.pageWithCondition(currentPageRequest);
        return page;
    }
    @PostMapping("/select")
    public String enrollStudentToCourse(Long studentId, Long curriculumId, Long requestId) {
        //从数据库查Log表是否有记录
        EnrollmentLog enrollmentLog = enrollmentLogService.getOne(new LambdaQueryWrapper<EnrollmentLog>()
                .eq(EnrollmentLog::getRequestId, requestId));
        if (enrollmentLog != null) {
            if (enrollmentLog.getStatus() == 1) {
                return "已经选课成功";
            }
            return "系统繁忙,请稍后重试";
        }
        //没有结果尝试拿到分布式锁，插入日志数据
        RLock lock = redissonClient.getLock("curriculum:" +"_" + "select" +"_" + curriculumId);
        try {
            // 尝试获取分布式锁
            boolean isLocked = lock.tryLock(500, 5000, TimeUnit.MILLISECONDS);
            if (isLocked) {
                // 执行需要加锁的操作
                //判断库存
                Curriculum curriculum = curriculumService.getOne(new LambdaQueryWrapper<Curriculum>().eq(Curriculum::getId, curriculumId));
                if (curriculum.getStock() <= 0) {
                    return "选课失败,该课程人数已满";
                }
                Enrollment enrollment = enrollmentService.getOne(new LambdaQueryWrapper<Enrollment>()
                        .eq(Enrollment::getCurriculumId, curriculumId)
                        .eq(Enrollment::getStudentId, studentId));
                if (enrollment != null) {
                    return "选课失败，你已经选过该课程:"+curriculum.getSubjectId();
                }
                EnrollmentLog Log = new EnrollmentLog();
                Log.setRequestId(requestId);
                Log.setStudentId(studentId);
                Log.setStatus(0);
                enrollmentLogService.save(Log);
                return enrollmentService.enrollStudentToCourse(studentId, curriculum, Log);
            } else {
                System.out.println("Failed to acquire lock for course: " + curriculumId);
                return "系统繁忙，请稍后再试";
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return "服务器出了点小差，请稍后再试";
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
                System.out.println("此课程已经释放锁: " + curriculumId);
            }
        }
    }

    /**
     * 退选课程
     */
    @PostMapping("/drop")
    public ResponseEntity<String> dropCourse(@RequestParam String studentId, @RequestParam Long courseId) {
        boolean success = enrollmentService.dropCourse(studentId, courseId);
        if (success) {
            return ResponseEntity.ok("退课成功");
        } else {
            return ResponseEntity.badRequest().body("退课失败，请确认课程信息是否正确");
        }
    }
    @PostMapping("/check")
    public boolean checkCourse(Long curriculumId) {
        return curriculumService.checkCourse(curriculumId);
    }
}