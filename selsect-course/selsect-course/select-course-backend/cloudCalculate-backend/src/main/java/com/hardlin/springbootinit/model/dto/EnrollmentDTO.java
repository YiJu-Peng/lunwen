package com.hardlin.springbootinit.model.dto;

import com.rabbitmq.client.Channel;
import lombok.Data;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;

import java.io.Serializable;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/2 15:50
 */
@Data
public class EnrollmentDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    Long userId;
    Long curriculumId;
}
     