FROM eclipse-temurin:17-jdk
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} searchEngine.jar
COPY dockerize /usr/local/bin/dockerize
RUN chmod +x /usr/local/bin/dockerize
EXPOSE 8081
ENTRYPOINT ["java","-jar","/searchEngine.jar"]