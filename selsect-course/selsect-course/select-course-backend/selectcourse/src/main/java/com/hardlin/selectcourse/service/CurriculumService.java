package com.hardlin.selectcourse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.hardlin.selectcourse.condition.CurriculumQueryCondition;
import com.hardlin.selectcourse.entity.Curriculum;
import com.baomidou.mybatisplus.extension.service.IService;
import com.hardlin.selectcourse.entity.CurriculumPageRequest;
import com.hardlin.selectcourse.util.PageParam;

/**
* @author 13179
* @description 针对表【curriculum】的数据库操作Service
* @createDate 2024-12-03 21:42:58
*/
public interface CurriculumService extends IService<Curriculum> {
    IPage<Curriculum> pageWithCondition(CurriculumPageRequest currentPageRequest);

    boolean checkCourse(Long curriculumId);
}
