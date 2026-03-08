package com.hardlin.springbootinit.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hardlin.springbootinit.service.ScoreService;
import com.hardlin.springbootinit.model.entity.Score;
import com.hardlin.springbootinit.mapper.ScoreMapper;
import org.springframework.stereotype.Service;

/**
* @author 13179
* @description 针对表【score】的数据库操作Service实现
* @createDate 2024-06-17 22:33:19
*/
@Service
public class ScoreServiceImpl extends ServiceImpl<ScoreMapper, Score>
    implements ScoreService {

}




