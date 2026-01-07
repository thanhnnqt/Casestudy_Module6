package org.example.case_study_module_6.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dhlp7pnpn",
                "api_key", "411312418664949",
                "api_secret", "3YoWzAE9KWP-WfmTbXaqtugg6YU",
                "secure", true
        ));
    }
}
