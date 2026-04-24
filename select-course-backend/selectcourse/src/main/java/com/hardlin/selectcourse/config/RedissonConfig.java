package com.hardlin.selectcourse.config;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/3 15:12
 */

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedissonConfig {

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer()
//                .setAddress("redis://select-course-redis-service:6379");
//                .setAddress("redis://host.docker.internal:6379");
                .setAddress("redis://localhost:6379");
        return Redisson.create(config);
    }
}
     