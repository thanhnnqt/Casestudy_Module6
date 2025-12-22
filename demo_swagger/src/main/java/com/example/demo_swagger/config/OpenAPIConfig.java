package com.example.demo_swagger.config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Demo APIs")
                        .version("1.0.0")
                        .description("Swagger demo cho Spring Boot")
                        .contact(new Contact().name("an").email("annguyendang.17.07.2002@gmail.com")
                        .url("https://mail.google.com/mail/u/0/#inbox"))

                );
    }
}
