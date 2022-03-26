package com.bindtape.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@SpringBootApplication
@EnableResourceServer
public class BindtapeBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(BindtapeBootApplication.class, args);
    }
}
