FROM openjdk:17
EXPOSE 8080 
ARG JAR_FILE=target/starling-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} backend.jar
COPY . .
ENTRYPOINT ["java","-jar","/backend.jar"]
