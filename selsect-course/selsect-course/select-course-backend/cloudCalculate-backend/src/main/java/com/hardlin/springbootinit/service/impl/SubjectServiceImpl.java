package com.hardlin.springbootinit.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hardlin.springbootinit.model.entity.Subject;
import com.hardlin.springbootinit.service.SubjectService;
import com.hardlin.springbootinit.mapper.SubjectMapper;
import org.springframework.stereotype.Service;

/**
* @author 13179
* @description 针对表【subject】的数据库操作Service实现
* @createDate 2024-06-17 22:33:19
*/
@Service
public class SubjectServiceImpl extends ServiceImpl<SubjectMapper, Subject>
    implements SubjectService {

}




