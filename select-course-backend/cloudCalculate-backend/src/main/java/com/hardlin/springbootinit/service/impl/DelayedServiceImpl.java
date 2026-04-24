package com.hardlin.springbootinit.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hardlin.springbootinit.model.entity.Delayed;
import com.hardlin.springbootinit.service.DelayedService;
import com.hardlin.springbootinit.mapper.DelayedMapper;
import org.springframework.stereotype.Service;

/**
* @author 13179
* @description 针对表【delayed】的数据库操作Service实现
* @createDate 2024-06-17 22:33:19
*/
@Service
public class DelayedServiceImpl extends ServiceImpl<DelayedMapper, Delayed>
    implements DelayedService {

}




