package com.tvu.quanlytaisan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class QuanlytaisanApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuanlytaisanApplication.class, args);
    }

}
