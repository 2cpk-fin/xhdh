package com.xhdh.xhdh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication()
@EnableScheduling
@EnableJpaRepositories(
    basePackages = "com.xhdh.xhdh.infrastructure.repositories.jpa"
)

@EnableRedisRepositories(
    basePackages = "com.xhdh.xhdh.infrastructure.repositories.redis"
)
public class XhdhApplication {


	public static void main(String[] args) {
		Dotenv.configure()
		.ignoreIfMissing()
		.systemProperties()
		.load();
		SpringApplication.run(XhdhApplication.class, args);
	}

}
