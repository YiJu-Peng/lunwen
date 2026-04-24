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
 * 课表相关接口
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
     * 查询当前登录用户的课表
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
        
        // 周次先按日期估算，后续可以接入学期配置
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        scheduleVO.setCurrentPeriod("第" + (calendar.get(Calendar.WEEK_OF_YEAR) - 8) + "周，" + sdf.format(calendar.getTime()));
        
        // 当前统一按周课表返回
        scheduleVO.setScheduleType("周课表");
        
        // 学生和教师分别走各自的查询逻辑
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
     * 查询指定学生的课表
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
        
        // 顺手补上当前周次
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        scheduleVO.setCurrentPeriod("第" + (calendar.get(Calendar.WEEK_OF_YEAR) - 8) + "周，" + sdf.format(calendar.getTime()));
        
        // 当前统一按周课表返回
        scheduleVO.setScheduleType("周课表");
        
        return getStudentSchedule(user.getId(), scheduleVO);
    }
    
    /**
     * 查询指定教师的课表
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
        
        // 顺手补上当前周次
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        scheduleVO.setCurrentPeriod("第" + (calendar.get(Calendar.WEEK_OF_YEAR) - 8) + "周，" + sdf.format(calendar.getTime()));
        
        // 当前统一按周课表返回
        scheduleVO.setScheduleType("周课表");
        
        return getTeacherSchedule(user.getId(), scheduleVO);
    }
    
    /**
     * 组装学生课表
     */
    private BaseResponse<ScheduleVO> getStudentSchedule(Long userId, ScheduleVO scheduleVO) {
        // 先查学生档案
        Student student = studentService.lambdaQuery().eq(Student::getUserId, userId).one();
        if (student == null) {
            return ResultUtils.error(40000, "学生信息不存在");
        }
        
        scheduleVO.setPersonId(student.getId().longValue());
        scheduleVO.setName(student.getStudentName());
        
        // 先汇总学生当前已选课程
        List<Curriculum> selectedCourses = curriculumService.getStudentSelectedCourses(userId);
        
        // 再转成课表结构
        processCourseData(selectedCourses, scheduleVO);
        
        return ResultUtils.success(scheduleVO);
    }
    
    /**
     * 组装教师课表
     */
    private BaseResponse<ScheduleVO> getTeacherSchedule(Long userId, ScheduleVO scheduleVO) {
        // 先查教师档案
        Teacher teacher = teacherService.lambdaQuery().eq(Teacher::getUserId, userId).one();
        if (teacher == null) {
            return ResultUtils.error(40000, "教师信息不存在");
        }
        
        scheduleVO.setPersonId(teacher.getId().longValue());
        scheduleVO.setName(teacher.getTeacherName());
        
        // 把教师名下的授课记录都查出来
        List<Curriculum> teachingCourses = curriculumService.lambdaQuery()
                .eq(Curriculum::getTeacherId, teacher.getId())
                .list();
        
        // 再转成课表结构
        processCourseData(teachingCourses, scheduleVO);
        
        return ResultUtils.success(scheduleVO);
    }
    
    /**
     * 把课程记录转换成课表结构
     */
    private void processCourseData(List<Curriculum> courses, ScheduleVO scheduleVO) {
        Map<Integer, List<ScheduleCourseItemVO>> scheduleData = new HashMap<>();
        List<ScheduleCourseItemVO> allCourses = new ArrayList<>();
        
        // 先把周一到周日的容器补齐
        for (int i = 1; i <= 7; i++) {
            scheduleData.put(i, new ArrayList<>());
        }
        
        // 课表卡片用到的颜色池
        String[] colors = {
            "#FF5733", "#33FF57", "#3357FF", "#F033FF", "#FF33A1", 
            "#33FFF0", "#F3FF33", "#FF8C33", "#8C33FF", "#33FF8C"
        };
        
        // 逐条组装前端要展示的数据
        int colorIndex = 0;
        for (Curriculum course : courses) {
            ScheduleCourseItemVO courseItem = new ScheduleCourseItemVO();
            courseItem.setCurriculumId(course.getId().longValue());
            // 科目名称这里先用占位值
            courseItem.setSubjectName("科目" + course.getSubjectId()); // 正式环境下更建议从科目服务读取
            
            // 教师名称再按 teacherId 查一遍
            Teacher teacher = teacherService.getById(course.getTeacherId());
            if (teacher != null) {
                courseItem.setTeacherName(teacher.getTeacherName());
                courseItem.setTeacherId(teacher.getId().longValue());
            }
            
            courseItem.setLocation(course.getLocation());
            
            // 把上课时间拆成前端需要的字段
            Date teachingTime = course.getTeachingTime();
            if (teachingTime != null) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(teachingTime);
                
                // 先拿到星期几
                int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
                // Calendar 的周序和业务定义不一致，这里做一次换算
                dayOfWeek = dayOfWeek == 1 ? 7 : dayOfWeek - 1;
                
                courseItem.setDayOfWeek(dayOfWeek);
                courseItem.setStartHour(cal.get(Calendar.HOUR_OF_DAY));
                courseItem.setStartMinute(cal.get(Calendar.MINUTE));
                cal.add(Calendar.HOUR_OF_DAY, 2); // 假设课程时长为2小时
                courseItem.setEndHour(cal.get(Calendar.HOUR_OF_DAY));
                courseItem.setEndMinute(cal.get(Calendar.MINUTE));
                
                // 拼一个给前端直接展示的时间串
                SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
                courseItem.setTeachingTime(sdf.format(teachingTime) + "-" + sdf.format(cal.getTime()));
                
                // 这里先按每周都有课处理
                courseItem.setWeeks("1-16");
                
                // 给课程分配展示颜色
                courseItem.setColor(colors[colorIndex % colors.length]);
                colorIndex++;
                
                // 放进当天的课程列表
                scheduleData.get(dayOfWeek).add(courseItem);
                
                // 顺手也放进总课程列表
                allCourses.add(courseItem);
            }
        }
        
        scheduleVO.setScheduleData(scheduleData);
        scheduleVO.setCourseList(allCourses);
    }
} 
