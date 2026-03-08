# 选课系统统一鉴权和网关实施方案

## 架构概述

选课系统采用了微服务架构，使用Spring Cloud Gateway作为API网关，Sa-Token作为统一认证框架，实现了分布式认证和权限控制。

## 组件说明

### 1. API网关（api-gateway）

API网关是系统的唯一入口，负责路由转发和权限控制。

- **路由配置**：根据URL路径将请求转发到相应的微服务
- **统一鉴权**：使用Sa-Token拦截所有请求，检查用户登录状态和权限
- **全局异常处理**：统一处理认证和权限异常，返回标准格式的错误信息
- **跨域配置**：支持前端跨域请求

### 2. 认证服务（包含在cloudCalculate-backend）

负责用户登录、注册、注销等认证功能：

- **用户认证**：验证用户身份并生成token
- **角色管理**：为用户分配角色，确定其权限范围
- **Token管理**：负责token的创建、验证和刷新

### 3. 权限控制

基于Sa-Token实现细粒度的权限控制：

- **角色控制**：基于用户角色（学生、教师、管理员）限制访问
- **接口权限**：细粒度控制API接口的访问权限
- **数据权限**：确保用户只能访问自己有权限的数据

## 认证流程

1. 用户通过登录接口（/api/user/login）提交账号密码
2. 认证服务验证身份后使用Sa-Token生成token并返回
3. 前端保存token到localStorage
4. 后续请求通过请求头携带token
5. 网关拦截请求，验证token有效性和权限
6. 请求转发到相应微服务处理业务逻辑

## 权限设计

系统定义了三种主要角色：

- **学生**：可访问选课、查看课表等学生功能
- **教师**：可访问课程管理、班级管理等教师功能
- **管理员**：拥有所有权限，包括系统管理功能

## 配置详情

### 网关路由配置

```yaml
spring:
  cloud:
    gateway:
      routes:
        # 课程服务路由
        - id: course-service
          uri: lb://cloudCalculate-backend
          predicates:
            - Path=/api/curriculum/**, /api/subject/**, /api/schedule/**
        # 用户服务路由
        - id: user-service
          uri: lb://cloudCalculate-backend
          predicates:
            - Path=/api/user/**, /api/student/**, /api/teacher/**
        # 选课服务路由
        - id: select-course-service
          uri: lb://cloudCalculate-backend
          predicates:
            - Path=/api/select-course/**
```

### Sa-Token配置

```yaml
sa-token:
  # token名称（同时也是cookie名称）
  token-name: Authorization
  # token有效期（单位：秒），默认30天
  timeout: 2592000
  # token临时有效期
  activity-timeout: -1
  # 是否允许同一账号多地同时登录
  is-concurrent: true
  # token风格
  token-style: uuid
  # token前缀
  token-prefix: "Bearer"
```

## 前端实现

前端通过localStorage存储token，并通过请求拦截器自动添加到请求头：

```typescript
// 请求拦截器
requestInterceptors: [
  (config) => {
    // 从localStorage中获取token
    const tokenName = localStorage.getItem('tokenName');
    const tokenValue = localStorage.getItem('tokenValue');
    
    // 如果token存在，则添加到请求头中
    if (tokenName && tokenValue) {
      const headers = config.headers || {};
      headers[tokenName] = tokenValue;
      config.headers = headers;
    }
    
    return config;
  },
]
```

## 部署说明

1. 确保Redis服务正常运行，用于存储Sa-Token会话
2. 启动Nacos注册中心
3. 启动后端服务(cloudCalculate-backend)
4. 启动API网关(api-gateway)
5. 部署前端应用

## 安全建议

1. 使用HTTPS保护传输过程
2. 定期轮换密钥和证书
3. 实施请求限流和IP黑名单
4. 监控异常登录和访问行为 