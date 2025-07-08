package com.twicenice.twicenice_backend;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class TwiceniceBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TwiceniceBackendApplication.class, args);
	}
	@Bean
	public WebMvcConfigurer webMvcConfigurer() {
	    return new WebMvcConfigurer() {
	        @Override
	        public void addResourceHandlers(ResourceHandlerRegistry registry) {
	        	 
//	        	registry.addResourceHandler("/images/**")
	        	 registry.addResourceHandler("/api/products/images/**")
	                    .addResourceLocations("file:uploads/");
	        }
	    };
	}
}
