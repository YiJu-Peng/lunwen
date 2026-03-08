package com.hardlin.selectcourse.entity;

import com.hardlin.selectcourse.util.PageParam;
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
    private String subjectName;
    private Integer isCheck;

    public CurriculumPageRequest(long current, long pageSize) {
        super(current, pageSize);
    }

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
     