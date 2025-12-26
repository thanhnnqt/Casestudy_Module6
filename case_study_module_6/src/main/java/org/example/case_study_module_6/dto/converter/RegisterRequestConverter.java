package org.example.case_study_module_6.dto.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.example.case_study_module_6.dto.RegisterRequest;

@Converter
public class RegisterRequestConverter
        implements AttributeConverter<RegisterRequest, String> {

    private final ObjectMapper objectMapper;

    public RegisterRequestConverter() {
        this.objectMapper = JsonMapper.builder()
                .addModule(new JavaTimeModule()) // 🔥 FIX LocalDate
                .build();
    }

    @Override
    public String convertToDatabaseColumn(RegisterRequest attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Cannot convert RegisterRequest to JSON", e
            );
        }
    }

    @Override
    public RegisterRequest convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, RegisterRequest.class);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Cannot convert JSON to RegisterRequest", e
            );
        }
    }
}
