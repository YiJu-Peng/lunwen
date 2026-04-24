package com.hardlin.springbootinit.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hardlin.springbootinit.model.entity.Message;
import generator.domain.message;
import com.hardlin.springbootinit.service.MessageService;
import com.hardlin.springbootinit.mapper.MessageMapper;
import org.springframework.stereotype.Service;

/**
* @author 13179
* @description 针对表【message】的数据库操作Service实现
* @createDate 2024-12-26 08:41:13
*/
@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message>
    implements MessageService {

}




