# 高校智能选课系统部署文档

本文档用于在一台新机器上从 GitHub 拉取项目后完成本地运行、演示和部署。项目源码已经提交到仓库；`node_modules/`、`dist/`、`target/` 是依赖目录或构建产物，被 `.gitignore` 忽略，部署时重新安装或重新构建即可。

## 1. 项目结构

```text
selsect-course/selsect-course/
├── SQL/
│   ├── cloud_calculate.sql        # 主服务数据库脚本
│   └── enrollment.sql             # 选课服务数据库脚本
├── cloudCalculate-front/myapp/    # 前端，Umi Max + Ant Design Pro
└── select-course-backend/
    ├── cloudCalculate-backend/    # 主业务服务，端口 8101，context-path /api
    ├── selectcourse/              # 选课服务，端口 8081
    └── new-api-gateway/           # API 网关，端口 9000
```

系统入口关系：

```text
浏览器 http://localhost:8000
  -> 前端请求 http://localhost:9000/api
  -> API 网关按路径转发
     -> /api/enrollments/** 和 /api/schedule/** 转发到 enrollment-service:8081
     -> 其他 /api/** 转发到 main-service:8101
```

## 2. 环境要求

推荐版本：

```text
JDK 8
Maven 3.6+
Node.js 16 或 18
npm 8+
MySQL 8.x
Redis 6+
Nacos 2.x
RabbitMQ 3.x
```

后端默认配置使用这些本地地址：

```text
MySQL:    localhost:3306，账号 root，密码 root
Redis:    localhost:6379
Nacos:    localhost:8848
RabbitMQ: localhost:5672，账号 guest，密码 guest
```

如果你的 MySQL 密码不是 `root`，需要修改：

```text
select-course-backend/cloudCalculate-backend/src/main/resources/application.yml
select-course-backend/selectcourse/src/main/resources/application.yml
```

## 3. 初始化数据库

登录 MySQL 后执行：

```sql
CREATE DATABASE IF NOT EXISTS cloud_calculate DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS enrollment DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

然后在项目根目录执行：

```bash
mysql -uroot -proot cloud_calculate < SQL/cloud_calculate.sql
mysql -uroot -proot enrollment < SQL/enrollment.sql
```

如果你的 MySQL 版本较旧，不支持 `utf8mb4_0900_ai_ci`，可以先把 SQL 文件里的 `utf8mb4_0900_ai_ci` 替换为 `utf8mb4_general_ci` 再导入。

## 4. 启动基础服务

### 4.1 Redis

```bash
redis-server
```

确认：

```bash
redis-cli ping
```

返回 `PONG` 即可。

### 4.2 Nacos

下载并解压 Nacos 后，以单机模式启动：

```bash
sh startup.sh -m standalone
```

确认 Nacos 控制台可访问：

```text
http://localhost:8848/nacos
```

### 4.3 RabbitMQ

本地安装后启动 RabbitMQ 服务，并确认端口 `5672` 可用。默认账号密码为：

```text
guest / guest
```

## 5. 启动后端服务

需要开启三个终端，分别启动三个 Spring Boot 服务。

### 5.1 主业务服务 main-service

```bash
cd select-course-backend/cloudCalculate-backend
mvn spring-boot:run
```

启动成功后访问：

```text
http://localhost:8101/api/doc.html
```

### 5.2 选课服务 enrollment-service

```bash
cd select-course-backend/selectcourse
mvn spring-boot:run
```

测试接口：

```text
http://localhost:8081/api/enrollments/test
```

### 5.3 API 网关 api-gateway

```bash
cd select-course-backend/new-api-gateway
mvn spring-boot:run
```

网关启动端口：

```text
http://localhost:9000
```

网关依赖 Nacos 服务发现，所以启动顺序建议是：

```text
Nacos -> Redis -> RabbitMQ -> main-service -> enrollment-service -> api-gateway
```

## 6. 启动前端

```bash
cd cloudCalculate-front/myapp
npm install
npm run start:dev
```

浏览器访问：

```text
http://localhost:8000
```

前端默认请求地址在：

```text
cloudCalculate-front/myapp/src/requestConfig.ts
```

当前配置为：

```text
http://localhost:9000/api
```

如果部署到服务器，需要把这里改成服务器网关地址，例如：

```text
http://服务器IP:9000/api
```

或者在 Nginx 中把 `/api` 反向代理到网关。

## 7. 系统如何进入

### 7.1 登录入口

启动前端后打开：

```text
http://localhost:8000/user/login
```

也可以直接打开：

```text
http://localhost:8000
```

未登录时会自动跳转到登录页。

### 7.2 可用测试账号

SQL 中包含初始化用户。常用演示账号：

```text
管理员账号: sacxz
管理员密码: 123456
```

部分学生账号的密码等于学号，例如：

```text
学生账号: 101110102
学生密码: 101110102
```

登录成功后前端会把 Sa-Token 返回的 `Authorization` token 写入 `localStorage`，之后请求会自动携带：

```text
Authorization: Bearer <token>
```

### 7.3 主要页面

```text
/user/login        登录页
/                  首页/欢迎页
/welcome           欢迎页
/courseSelect      选课页面
/course-recommendations 课程推荐
/selected          已选课程
/schedule          课表
/userCenter        个人中心
/userMessage       用户消息
/admin/upload      管理员导入页面
/admin/course      课程管理
/admin/student     学生管理
/admin/teacher     教师管理
```

实际菜单以登录角色和前端路由配置为准：

```text
cloudCalculate-front/myapp/config/routes.ts
```

## 8. 生产部署建议

### 8.1 后端打包

三个后端模块分别打包：

```bash
cd select-course-backend/cloudCalculate-backend
mvn clean package -DskipTests

cd ../selectcourse
mvn clean package -DskipTests

cd ../new-api-gateway
mvn clean package -DskipTests
```

打包产物在各模块的 `target/` 目录下。`target/` 不需要提交到 Git。

### 8.2 前端打包

```bash
cd cloudCalculate-front/myapp
npm install
npm run build
```

打包产物在：

```text
cloudCalculate-front/myapp/dist/
```

`dist/` 不需要提交到 Git，服务器部署时由构建命令生成。

### 8.3 Nginx 示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /opt/select-course/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:9000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Authorization $http_authorization;
    }
}
```

如果使用 Nginx 代理 `/api`，前端请求地址可以改成相对路径 `/api`，避免写死服务器 IP。

## 9. 常见问题

### 9.1 前端能打开，但登录失败

检查：

```text
1. API 网关 9000 是否启动
2. main-service 8101 是否注册到 Nacos
3. requestConfig.ts 的 baseURL 是否指向网关
4. MySQL 是否导入 cloud_calculate.sql
```

### 9.2 网关启动后找不到服务

检查 Nacos：

```text
http://localhost:8848/nacos
```

服务列表中应看到：

```text
main-service
enrollment-service
api-gateway
```

### 9.3 选课、课表接口失败

检查：

```text
1. enrollment-service 8081 是否启动
2. enrollment 数据库是否导入 SQL/enrollment.sql
3. Redis 是否启动
```

### 9.4 文件上传失败

管理员导入页面里有部分上传接口直接请求 `http://localhost:8101/api/...`。如果部署到服务器，需要把这些地址改为服务器主业务服务地址，或统一改为网关 `/api/...`。

相关文件：

```text
cloudCalculate-front/myapp/src/pages/admin/Admin.tsx
```

### 9.5 哪些文件没提交是正常的

这些目录被忽略是正常的：

```text
cloudCalculate-front/myapp/node_modules/
cloudCalculate-front/myapp/dist/
select-course-backend/*/target/
```

它们分别是前端依赖、前端构建产物、后端构建产物。新机器执行 `npm install`、`npm run build`、`mvn package` 会重新生成。
