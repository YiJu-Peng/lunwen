package com.hardlin.springbootinit.config;
import com.hardlin.springbootinit.consumer.EnrollmentConsumer;
import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/23 15:43
 */
@Configuration
public class RabbitConfig {
    public static final String QUEUE_NAME = "enrollmentQueue";
    @Bean()
    public Queue queue(){
        return new Queue(QUEUE_NAME);
    }
    @Bean
    public SimpleMessageListenerContainer container(ConnectionFactory connectionFactory,
                                                    MessageListenerAdapter listenerAdapter) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(QUEUE_NAME);
        container.setMessageListener(listenerAdapter);
        container.setPrefetchCount(1); // 确保每次只处理一条消息
        container.setConcurrentConsumers(5); // 最小并发消费者数量
        container.setMaxConcurrentConsumers(10); // 最大并发消费者数量
        return container;
    }

    @Bean
    public MessageListenerAdapter listenerAdapter(EnrollmentConsumer receiver) {
        return new MessageListenerAdapter(receiver, "receive");
    }
}
     