package com.hardlin.springbootinit.model.dto.curriculum;

import com.hardlin.springbootinit.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.Date;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/1 17:24
 */
@Data
public class CurriculumRequest extends PageRequest implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;

    private Integer subjectId;
    private Integer teacherId;

    private String location;
    private String remarks;

    private Date createTime;

    private Date updateTime;
    private String subjectName;
    private Integer isCheck;

}
     