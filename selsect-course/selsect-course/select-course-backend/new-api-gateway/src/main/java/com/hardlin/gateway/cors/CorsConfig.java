//package com.hardlin.gateway.cors;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.Ordered;
//import org.springframework.core.annotation.Order;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.http.server.reactive.ServerHttpResponse;
//import org.springframework.web.cors.reactive.CorsUtils;
//import org.springframework.web.server.ServerWebExchange;
//import org.springframework.web.server.WebFilter;
//import org.springframework.web.server.WebFilterChain;
//import reactor.core.publisher.Mono;
//
///**
// * 跨域配置
// *
// * @author DawnCclin
// */
//@Configuration
//public class CorsConfig {
//
//    /**
//     * 创建CORS过滤器，优先级最高
//     */
//    @Bean
//    @Order(Ordered.HIGHEST_PRECEDENCE)
//    public WebFilter corsFilter() {
//        return (ServerWebExchange exchange, WebFilterChain chain) -> {
//            ServerHttpRequest request = exchange.getRequest();
//
//            if (CorsUtils.isCorsRequest(request)) {
//                ServerHttpResponse response = exchange.getResponse();
//                HttpHeaders headers = response.getHeaders();
//
//                // 设置允许跨域的源（可以指定具体的源）
//                headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:8000");
//                headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET,POST,PUT,DELETE,OPTIONS");
//                headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "Origin,Content-Type,Accept,Authorization");
//                headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
//                headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Content-Type,Authorization");
//                headers.add(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "3600");
//
//                // 对于OPTIONS请求，直接返回200，不再继续路由
//                if (request.getMethod() == HttpMethod.OPTIONS) {
//                    response.setStatusCode(HttpStatus.OK);
//                    System.out.println("处理OPTIONS请求: " + request.getURI().getPath());
//                    return Mono.empty();
//                }
//            }
//
//            return chain.filter(exchange);
//        };
//    }
//}