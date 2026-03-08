package com.hardlin.springbootinit.controller.cloudCalculate;

import com.hardlin.springbootinit.common.BaseResponse;
import com.hardlin.springbootinit.common.ResultUtils;
import com.hardlin.springbootinit.model.dto.curriculum.CurriculumRequest;
import com.hardlin.springbootinit.model.entity.Curriculum;
import com.hardlin.springbootinit.model.entity.Student;
import com.hardlin.springbootinit.model.entity.Teacher;
import com.hardlin.springbootinit.model.entity.User;
import com.hardlin.springbootinit.model.vo.ScheduleCourseItemVO;
import com.hardlin.springbootinit.model.vo.ScheduleVO;
import com.hardlin.springbootinit.service.CurriculumService;
import com.hardlin.springbootinit.service.StudentService;
import com.hardlin.springbootinit.service.TeacherService;
import com.hardlin.springbootinit.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 课程表控制器
 *
 * @author DawnCclin
 */
@RestController
@RequestMapping("/api/schedule")
@Slf4j
public class ScheduleController {

    @Resource
    private UserService userService;

    @Resource
    private StudentService studentService;

    @Resource
    private TeacherService teacherService;

    @Resource
    private CurriculumService curriculumService;

    /**
     * 获取当前用户的课程表
     *
     * @param request HTTP请求
     * @return 课程表数据
     */
    @GetMapping("/current")
    public BaseResponse<ScheduleVO> getCurrentUserSchedule(HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        Long userId = loginUser.getId();
        String userType = loginUser.getUserRole();
        
        ScheduleVO scheduleVO = new ScheduleVO();
        scheduleVO.setUserId(userId);
        scheduleVO.setUserType(userType);
        
        // 获取当前周次信息，这里简化处理，实际应从学期管理中获取
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        scheduleVO.setCurrentPeriod("第" + (calendar.get(Calendar.WEEK_OF_YEAR) - 8) + "周，" + sdf.format(calendar.getTime()));
        
        // 设置课程表类型
        scheduleVO.setScheduleType("周课表");
        
        // 根据用户类型获取相应的课程表数据
        if ("学生".equals(userType)) {
            return getStudentSchedule(userId, scheduleVO);
        } else if ("教师".equals(userType)) {
            return getTeacherSchedule(userId, scheduleVO);
        } else {
            scheduleVO.setName(loginUser.getUserName());
            scheduleVO.setScheduleData(new HashMap<>());
            scheduleVO.setCourseList(new ArrayList<>());
            return ResultUtils.success(scheduleVO);
        }
    }
    
    /**
     * 获取指定学生的课程表
     *
     * @param studentId 学生ID
     * @return 课程表数据
     */
    @GetMapping("/student/{studentId}")
    public BaseResponse<ScheduleVO> getStudentScheduleById(@PathVariable Long studentId) {
        Student student = studentService.getById(studentId);
        if (student == null) {
            return ResultUtils.error(40000, "学生不存在");
        }
        
        User user = userService.getById(student.getUserId());
        
        ScheduleVO scheduleVO = new ScheduleVO();
        scheduleVO.setUserId(user.getId());
        scheduleVO.setPersonId(studentId);
        scheduleVO.setName(student.getStudentName());
        scheduleVO.setUserType("学生");
        
        // 获取当前周次信息
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        scheduleVO.setCurrentPeriod("第" + (calendar.get(Calendar.WEEK_OF_YEAR) - 8) + "周，" + sdf.format(calendar.getTime()));
        
        // 设置课程表类型
        scheduleVO.setScheduleType("周课表");
        
        return getStudentSchedule(user.getId(), scheduleVO);
    }
    
    /**
     * 获取指定教师的课程表
     *
     * @param teacherId 教师ID
     * @return 课程表数据
     */
    @GetMapping("/teacher/{teacherId}")
    public BaseResponse<ScheduleVO> getTeacherScheduleById(@PathVariable Long teacherId) {
        Teacher teacher = teacherService.getById(teacherId);
        if (teacher == null) {
            return ResultUtils.error(40000, "教师不存在");
        }
        
        User user = userService.getById(teacher.getUserId());
        
        ScheduleVO scheduleVO = new ScheduleVO();
        scheduleVO.setUserId(user.getId());
        scheduleVO.setPersonId(teacherId);
        scheduleVO.setName(teacher.getTeacherName());
        scheduleVO.setUserType("教师");
        
        // 获取当前周次信息
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        scheduleVO.setCurrentPeriod("第" + (calendar.get(Calendar.WEEK_OF_YEAR) - 8) + "周，" + sdf.format(calendar.getTime()));
        
        // 设置课程表类型
        scheduleVO.setScheduleType("周课表");
        
        return getTeacherSchedule(user.getId(), scheduleVO);
    }
    
    /**
     * 获取学生课程表
     */
    private BaseResponse<ScheduleVO> getStudentSchedule(Long userId, ScheduleVO scheduleVO) {
        // 查询学生信息
        Student student = studentService.lambdaQuery().eq(Student::getUserId, userId).one();
        if (student == null) {
            return ResultUtils.error(40000, "学生信息不存在");
        }
        
        scheduleVO.setPersonId(student.getId().longValue());
        scheduleVO.setName(student.getStudentName());
        
        // 获取学生选课的课程，实际实现需根据您的选课逻辑来调整
        List<Curriculum> selectedCourses = curriculumService.getStudentSelectedCourses(userId);
        
        // 处理课程数据
        processCourseData(selectedCourses, scheduleVO);
        
        return ResultUtils.success(scheduleVO);
    }
    
    /**
     * 获取教师课程表
     */
    private BaseResponse<ScheduleVO> getTeacherSchedule(Long userId, ScheduleVO scheduleVO) {
        // 查询教师信息
        Teacher teacher = teacherService.lambdaQuery().eq(Teacher::getUserId, userId).one();
        if (teacher == null) {
            return ResultUtils.error(40000, "教师信息不存在");
        }
        
        scheduleVO.setPersonId(teacher.getId().longValue());
        scheduleVO.setName(teacher.getTeacherName());
        
        // 获取教师授课的课程
        List<Curriculum> teachingCourses = curriculumService.lambdaQuery()
                .eq(Curriculum::getTeacherId, teacher.getId())
                .list();
        
        // 处理课程数据
        processCourseData(teachingCourses, scheduleVO);
        
        return ResultUtils.success(scheduleVO);
    }
    
    /**
     * 处理课程数据，生成课程表
     */
    private void processCourseData(List<Curriculum> courses, ScheduleVO scheduleVO) {
        Map<Integer, List<ScheduleCourseItemVO>> scheduleData = new HashMap<>();
        List<ScheduleCourseItemVO> allCourses = new ArrayList<>();
        
        // 初始化每天的课程列表
        for (int i = 1; i <= 7; i++) {
            scheduleData.put(i, new ArrayList<>());
        }
        
        // 随机颜色数组，用于课程显示
        String[] colors = {
            "#FF5733", "#33FF57", "#3357FF", "#F033FF", "#FF33A1", 
            "#33FFF0", "#F3FF33", "#FF8C33", "#8C33FF", "#33FF8C"
        };
        
        // 处理每门课程
        int colorIndex = 0;
        for (Curriculum course : courses) {
            ScheduleCourseItemVO courseItem = new ScheduleCourseItemVO();
            courseItem.setCurriculumId(course.getId().longValue());
            // 这里需要先查询课程对应的科目名称
            courseItem.setSubjectName("科目" + course.getSubjectId()); // 实际应从科目服务获取
            
            // 根据教师ID获取教师名称
            Teacher teacher = teacherService.getById(course.getTeacherId());
            if (teacher != null) {
                courseItem.setTeacherName(teacher.getTeacherName());
                courseItem.setTeacherId(teacher.getId().longValue());
            }
            
            courseItem.setLocation(course.getLocation());
            
            // 处理上课时间
            Date teachingTime = course.getTeachingTime();
            if (teachingTime != null) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(teachingTime);
                
                // 获取星期几 (1-7)
                int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
                // Calendar的星期日是1，星期六是7，需要转换为我们的1-7（周一到周日）
                dayOfWeek = dayOfWeek == 1 ? 7 : dayOfWeek - 1;
                
                courseItem.setDayOfWeek(dayOfWeek);
                courseItem.setStartHour(cal.get(Calendar.HOUR_OF_DAY));
                courseItem.setStartMinute(cal.get(Calendar.MINUTE));
                cal.add(Calendar.HOUR_OF_DAY, 2); // 假设课程时长为2小时
                courseItem.setEndHour(cal.get(Calendar.HOUR_OF_DAY));
                courseItem.setEndMinute(cal.get(Calendar.MINUTE));
                
                // 格式化上课时间
                SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
                courseItem.setTeachingTime(sdf.format(teachingTime) + "-" + sdf.format(cal.getTime()));
                
                // 默认每周都有课
                courseItem.setWeeks("1-16");
                
                // 设置课程颜色
                courseItem.setColor(colors[colorIndex % colors.length]);
                colorIndex++;
                
                // 添加到对应天的列表中
                scheduleData.get(dayOfWeek).add(courseItem);
                
                // 添加到所有课程列表
                allCourses.add(courseItem);
            }
        }
        
        scheduleVO.setScheduleData(scheduleData);
        scheduleVO.setCourseList(allCourses);
    }
} 