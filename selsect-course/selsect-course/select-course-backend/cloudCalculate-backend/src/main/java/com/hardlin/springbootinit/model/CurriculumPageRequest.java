package com.hardlin.springbootinit.model;

import com.hardlin.springbootinit.model.entity.Curriculum;
import com.hardlin.springbootinit.utils.PageParam;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/14 18:24
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class CurriculumPageRequest extends PageParam<Curriculum> {

    public CurriculumPageRequest() {
        super();
    }
}
//@Data
//public class CurriculumPageRequest {
//    private String subjectName;
//    private Integer isCheck;
//    private Integer current = 1;
//    private Integer pageSize = 10;
//    private Integer size = 10;
//}
     