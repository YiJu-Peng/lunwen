package com.hardlin.springbootinit.controller.cloudCalculate;

import com.hardlin.springbootinit.mapper.*;
import com.hardlin.springbootinit.model.dto.*;
import com.hardlin.springbootinit.model.ClassFailCountDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/6/18 20:33
 */
@RestController
@RequestMapping("/calculate")
@Slf4j
public class CalculateController {
    @Autowired
    private ClassesMapper classMapper;

    @Autowired
    private SubjectMapper subjectMapper;

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ScoreMapper scoreMapper;
    @Autowired
    private DelayedMapper delayedMapper;

    @GetMapping("/list1")
    public List<CollegeCountDTO> list1(){
        List<CollegeCountDTO> collegeCountDTOS = delayedMapper.countByStudentCollege();
        return collegeCountDTOS;
    }
    @GetMapping("/list2")
    public List<ReasonCountDTO>  list2(){
        List<ReasonCountDTO> countDTOS = delayedMapper.countByDes();
        HashMap<String, Long> map = new HashMap<>();
        for (ReasonCountDTO countByDe :countDTOS ) {
            if (countByDe.getName().contains("疫情")){
                map.put("疫情原因不能返校", (map.getOrDefault("疫情原因不能返校", 0L)+countByDe.getValue()));
            }else if (countByDe.getName().contains("隔离")){
                map.put("隔离原因不能返校", (map.getOrDefault("疫情原因不能返校", 0L)+countByDe.getValue()));
                countByDe.setName("隔离原因不能返校");
            }else if (countByDe.getName().contains("静态")){
                map.put("隔离原因不能返校", (map.getOrDefault("隔离原因不能返校", 0L)+countByDe.getValue()));
            }
            else if (countByDe.getName().contains("事")){
                map.put("事假原因不能返校", (map.getOrDefault("事假原因不能返校", 0L)+countByDe.getValue()));
            }
            else if (countByDe.getName().contains("不适")){
                map.put("病假原因不能返校", (map.getOrDefault("病假原因不能返校", 0L)+countByDe.getValue()));
                countByDe.setName("病假原因不能返校");
            }else if (countByDe.getName().contains("病")) {
                map.put("病假原因不能返校", (map.getOrDefault("病假原因不能返校", 0L)+countByDe.getValue()));
                countByDe.setName("病假原因不能返校");
            }else{
                map.put(countByDe.getName(), (map.getOrDefault(countByDe.getName(), 0L)+countByDe.getValue()));
            }
        }
        List<ReasonCountDTO> reasonCountDTOList = new ArrayList<>();
        for (Map.Entry<String, Long> entry : map.entrySet()) {
            ReasonCountDTO reasonCountDTO = new ReasonCountDTO();
            reasonCountDTO.setName(entry.getKey());
            reasonCountDTO.setValue(entry.getValue());
            reasonCountDTOList.add(reasonCountDTO);
        }

        return reasonCountDTOList;
    }
    @GetMapping("/list3")
    //计算出来 "name": "A",
    //    "studentCount": "124",
    //    "averageScore": "74"
    // 算两个图 一个老师 和平时成绩的关系 一个老师教的学生数量和平时成绩
    public List<TeacherCountDTO> list3(){
        List<TeacherCountDTO> teacherCountDTOS = scoreMapper.analyzeTeacherPerformanceWithAnnotation();
        return teacherCountDTOS;
    }


    //平时成绩与挂科率计算 根据 平成绩小于60 75 80 90 分组 然后算每个区间的挂科人数
    @GetMapping("/list4")
    public List<UsualScoreDTO> list4(){
        List<UsualScoreDTO> failRateByUsualScoreRange = scoreMapper.getFailRateByUsualScoreRange();
        return failRateByUsualScoreRange;
    }
    //班级成绩分析 哪个班期末成绩高 根据班级分组 然后计算 每个班每门课的平均分
    @GetMapping("/list5")
    public List<ClassesAvgDTO> list5(){
        List<ClassesAvgDTO> classSubjectAverageScores = scoreMapper.getClassSubjectAverageScores();
        return classSubjectAverageScores;
    }
    //全班成绩：挂科率对比（无成绩视作挂科） 根据班级分组 确定好挂科人数 计算每个班的挂科率
    @GetMapping("/list6")
    public List<ClassFailCountDTO> list6(){
        List<ClassFailCountDTO> classFailCounts = scoreMapper.getClassFailCounts();
        return classFailCounts;
    }
    //每门课平均成绩对比
    @GetMapping("/list7")
    public List<CourseAverageScoreDTO> list7(){
        List<CourseAverageScoreDTO> subjectAverageScores = scoreMapper.getSubjectAverageScores();
        return subjectAverageScores;
    }
//    //专业课与公共课平时成绩与总评对比
//    @GetMapping("/list8")
//    public List<TeacherCountDTO> list8(){
//        List<TeacherCountDTO> teacherCountDTOS = scoreMapper.analyzeTeacherPerformanceWithAnnotation();
//        return teacherCountDTOS;
//    }
}
     