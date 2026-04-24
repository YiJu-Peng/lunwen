package com.hardlin.springbootinit.consumer;

import com.hardlin.springbootinit.config.RabbitConfig;
import com.hardlin.springbootinit.model.dto.EnrollmentDTO;
import com.hardlin.springbootinit.model.entity.Message;
import com.hardlin.springbootinit.model.entity.Subject;
import com.hardlin.springbootinit.model.entity.User;
import com.hardlin.springbootinit.service.*;
import com.hardlin.springbootinit.utils.IdGenerator;
import com.rabbitmq.client.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/23 15:54
 */
@Component
public class EnrollmentConsumer {
    private static final Logger logger = LoggerFactory.getLogger(EnrollmentConsumer.class);

    @Autowired
    private EnrollmentClient enrollmentClient;
    @Autowired
    private StudentService studentService;
    @Autowired
    private UserService userService;
    @Autowired
    private MessageService messageService;
    @Autowired
    private SubjectService subjectService;
    @RabbitListener(queues = RabbitConfig.QUEUE_NAME)
    public void receive(EnrollmentDTO enrollment) throws Exception {
        try {
            Long userId = enrollment.getUserId();
            Long curriculumId = enrollment.getCurriculumId();
            Long studentId = studentService.getStudentId(userId);
            //生成一个16位随机流水号
            Long requestId = IdGenerator.generateRandomNumber(16);
            if (studentId != null){
                String string = enrollmentClient.enrollStudentToCourse(studentId, curriculumId, requestId);
                User user = userService.getById(userId);
                user.setUnReadMessage(user.getUnReadMessage()+1);
                userService.saveOrUpdate(user);
                Message message = new Message();
                if (string.contains("选过")){
                    String[] split = string.split(":");
                    Subject subject = subjectService.getById(split[1]);
                    message.setMessage(split[0]+"："+subject.getSubjectName());
                }else{
                    message.setMessage(string);
                }
                message.setUserId(userId);
                messageService.save(message);
            }
        } catch (Exception e) {
            logger.error("Failed to process enrollment", e);
            throw new RuntimeException(e);
        }
    }

}
     