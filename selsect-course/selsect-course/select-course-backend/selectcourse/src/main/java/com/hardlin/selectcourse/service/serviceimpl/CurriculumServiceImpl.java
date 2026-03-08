package com.hardlin.selectcourse.service.serviceimpl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hardlin.selectcourse.condition.CurriculumQueryCondition;
import com.hardlin.selectcourse.entity.Curriculum;
import com.hardlin.selectcourse.entity.CurriculumPageRequest;
import com.hardlin.selectcourse.service.CurriculumService;
import com.hardlin.selectcourse.mapper.CurriculumMapper;
import com.hardlin.selectcourse.util.PageParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
* @author 13179
* @description 针对表【curriculum】的数据库操作Service实现
* @createDate 2024-12-03 21:42:58
*/
@Service
public class CurriculumServiceImpl extends ServiceImpl<CurriculumMapper, Curriculum>
    implements CurriculumService{

    @Autowired
    private CurriculumMapper curriculumMapper;
    @Override
    public IPage<Curriculum> pageWithCondition(CurriculumPageRequest currentPageRequest) {
        QueryWrapper<Curriculum> queryWrapper = new QueryWrapper<>();

        if (currentPageRequest.getSubjectName() != null) {
            queryWrapper.like("subjectName", currentPageRequest.getSubjectName());
        }
        if (currentPageRequest.getIsCheck() != null) {
            queryWrapper.eq("isCheck", currentPageRequest.getIsCheck());
        }
        // 添加其他条件...

        return curriculumMapper.selectPage(new Page<>(currentPageRequest.getCurrent(), currentPageRequest.getSize()), queryWrapper);
    }

    @Override
    public boolean checkCourse(Long curriculumId) {
        Curriculum curriculum = this.getById(curriculumId);
        if (curriculum.getIsCheck() == 0){
            curriculum.setIsCheck(1);
            return this.updateById(curriculum);
        }
        return false;
    }
}




