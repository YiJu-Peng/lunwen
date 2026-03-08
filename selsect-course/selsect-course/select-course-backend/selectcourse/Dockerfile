# 基础镜像
FROM openjdk:8-jdk-alpine
WORKDIR /dockerWorkSpace

# 添加应用
ADD target/selectcourse-0.0.1-SNAPSHOT.jar selectcourse-0.0.1-SNAPSHOT.jar

EXPOSE 8081

ENTRYPOINT ["java","-jar","/dockerWorkSpace/selectcourse-0.0.1-SNAPSHOT.jar"]