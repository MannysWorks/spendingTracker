# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-24 AS build
WORKDIR /app

# Copy only pom.xml first to leverage Docker layer caching for dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy the rest of the source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- Run stage ----
FROM eclipse-temurin:24-jre-alpine
WORKDIR /app

# Copy only the built jar from the build stage — keeps final image small
COPY --from=build /app/target/*.jar app.jar

# Render injects PORT env var; Spring Boot needs to listen on it
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]