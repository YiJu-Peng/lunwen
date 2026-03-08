# 基础镜像
FROM openjdk:8-jdk-alpine
WORKDIR /dockerWorkSpace

# 添加应用
ADD target/springboot-init-0.0.1-SNAPSHOT.jar springboot-init-0.0.1-SNAPSHOT.jar

EXPOSE 8101

ENTRYPOINT ["java","-jar","/dockerWorkSpace/springboot-init-0.0.1-SNAPSHOT.jar","--spring.profiles.active=dev"]