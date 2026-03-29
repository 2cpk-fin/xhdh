# STAGE 1: Build (The Kitchen)
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Step 1: Cache dependencies (The "DevOps" Speed Hack)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Step 2: Build the application
COPY src ./src
RUN mvn clean package -DskipTests -B

# STAGE 2: Run (The Dining Room)
# Use the lightweight Java 21 Runtime (JRE)
FROM eclipse-temurin:21-jre-jammy

# Install curl for the Healthcheck pulse
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Security: Create a restricted 'spring' user
RUN groupadd -r spring && useradd -r -g spring spring
WORKDIR /app

# Copy only the final JAR from the 'build' stage
COPY --from=build /app/target/*.jar app.jar
RUN chown spring:spring app.jar

# Switch to the restricted user
USER spring:spring

# Standard Spring Port
EXPOSE 8000

# The Pulse: Docker checks this every 30s to see if the app is frozen
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/actuator/health || exit 1

# Maxed Out Execution Flags
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", \
  "app.jar"]