# 基础镜像
FROM openjdk:8-jdk-alpine
WORKDIR /dockerWorkSpace

# 补充维护应用
ADD target/new-api-gateway-1.0.0.jar new-api-gateway-1.0.0.jar

EXPOSE 9000

ENTRYPOINT ["java","-jar","/dockerWorkSpace/new-api-gateway-1.0.0.jar"]