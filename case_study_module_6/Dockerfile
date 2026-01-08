# Backend Dockerfile (Gradle)
FROM gradle:8-jdk17-alpine AS build
WORKDIR /app
COPY . .
RUN gradle clean build -x test --no-daemon --stacktrace

FROM amazoncorretto:17-alpine
WORKDIR /app
# Copy specific JAR to avoid copying the *-plain.jar
COPY --from=build /app/build/libs/case_study_module_6-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
