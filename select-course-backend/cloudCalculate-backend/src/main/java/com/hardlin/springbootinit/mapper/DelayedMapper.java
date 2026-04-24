package com.hardlin.springbootinit.mapper;

import com.hardlin.springbootinit.model.dto.CollegeCountDTO;
import com.hardlin.springbootinit.model.dto.ReasonCountDTO;
import com.hardlin.springbootinit.model.entity.Delayed;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

/**
* @author 13179
* @description 针对表【delayed】的数据库操作Mapper
* @createDate 2024-06-17 22:33:19
* @Entity com.yupi.springbootinit.model.entity.delayed
*/
public interface DelayedMapper extends BaseMapper<Delayed> {
    @Select("SELECT studentCollege AS name, COUNT(*) AS value FROM delayedes GROUP BY studentCollege")
    List<CollegeCountDTO> countByStudentCollege();

    @Select("SELECT des AS name, COUNT(*) AS value FROM delayedes WHERE des IS NOT NULL GROUP BY des")
    List<ReasonCountDTO> countByDes();
}




