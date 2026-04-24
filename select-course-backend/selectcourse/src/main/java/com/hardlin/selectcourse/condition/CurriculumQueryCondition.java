package com.hardlin.selectcourse.condition;

import lombok.Data;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/14 18:16
 */
@Data
public class CurriculumQueryCondition {
     private String subjectName; // 根据课程名称查询
     private Integer isCheck; // 根据学分查询
     // 其他条件...

     // Getters and Setters
}
     