package com.bang9634.yasongmuseum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class YasongmuseumApplication {
	private static final Logger logger = LoggerFactory.getLogger(YasongmuseumApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(YasongmuseumApplication.class, args);
	}

	@Bean
	public ApplicationListener<ApplicationReadyEvent> applicationReadyListener(Environment environment) {
		return event -> {
			try {
				String port = environment.getProperty("server.port", "8080");
				String host = InetAddress.getLocalHost().getHostAddress();
				String environmentType = environment.getProperty("spring.profiles.active", "default");
				String[] profiles = environment.getActiveProfiles();
				String profile = profiles.length > 0 ? String.join(", ", profiles) : "default";

				logger.info("Application '{}' info':\n" +
								"\tEnvironmnet: \t{}\n" +
								"\tLocal: \t\thttp://localhost:{}\n" +
								"\tExternal: \thttp://{}:{}\n" +
								"\tProfile(s): \t{}",
						environment.getProperty("spring.application.name", "Yasongmuseum"),
						environmentType,
						port,
						host,
						port,
						profile
				);
			} catch (UnknownHostException e) {
				logger.error("Failed to log application startup information", e);
			}
		};
	}

}
