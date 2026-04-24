package com.hardlin.gateway.auth;

import cn.dev33.satoken.context.SaHolder;
import cn.dev33.satoken.reactor.filter.SaReactorFilter;
import cn.dev33.satoken.router.SaHttpMethod;
import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Sa-Token 权限认证配置
 *
 * @author DawnCclin
 */
@Configuration
public class SaTokenConfig {

    /**
     * 注册 Sa-Token 全局过滤器
     */
    @Bean
    public SaReactorFilter saReactorFilter() {
        return new SaReactorFilter()
                .addInclude("/**")
                .addExclude(
                        "/favicon.ico",
                        "/api/user/login",
                        "/api/user/register",
                        "/api/user/captcha"
                )
                .setAuth(obj -> {
                    ServerWebExchange exchange = (ServerWebExchange) obj;
                    SaRouter.match("/**", StpUtil::checkLogin);
                })
                .setError(e -> {
                    e.printStackTrace();
                    return SaResult.error(e.getMessage());
                })
                .setBeforeAuth(obj -> {
                    SaHolder.getResponse()
                            .setHeader("Access-Control-Allow-Origin", "http://localhost:8000")
                            .setHeader("Access-Control-Allow-Methods", "*")
                            .setHeader("Access-Control-Allow-Headers", "authorization, content-type")
                            .setHeader("Access-Control-Allow-Credentials", "true")
                            .setHeader("Access-Control-Max-Age", "3600");
                    SaRouter.match(SaHttpMethod.OPTIONS)
                            .free(r -> System.out.println("--------OPTIONS预检请求，不做处理"))
                            .back();
                });
    }
} 