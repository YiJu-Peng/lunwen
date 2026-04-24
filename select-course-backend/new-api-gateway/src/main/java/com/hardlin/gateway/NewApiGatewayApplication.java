package com.hardlin.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

/**
 * 网关应用主类
 * 
 * @author DawnCclin
 */
@SpringBootApplication
@EnableDiscoveryClient
public class NewApiGatewayApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(NewApiGatewayApplication.class, args);
    }
    
    /**
     * 启动成功后打印信息
     */
    @Bean
    public CommandLineRunner startupMessage() {
        return args -> {
            System.out.println("\n===========================================");
            System.out.println("API网关已启动");
            System.out.println("端口: 9000");
            System.out.println("CORS配置: 已启用");
            System.out.println("Sa-Token: 已集成");
            System.out.println("===========================================\n");
        };
    }
} 