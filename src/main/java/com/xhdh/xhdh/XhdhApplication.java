package com.xhdh.xhdh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication()
@EnableScheduling
public class XhdhApplication {

	public static void main(String[] args) {
		Dotenv.configure()
		.ignoreIfMissing()
		.systemProperties()
		.load();
		SpringApplication.run(XhdhApplication.class, args);
	}

}
