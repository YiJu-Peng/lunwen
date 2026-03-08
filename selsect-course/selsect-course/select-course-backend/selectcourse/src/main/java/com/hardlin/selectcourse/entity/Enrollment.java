package com.hardlin.selectcourse.entity;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/2 13:39
 */
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("enrollment")
public class Enrollment {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long curriculumId;
    private Long studentId;

    // Getters and Setters (Lombok will generate these automatically)
}
     