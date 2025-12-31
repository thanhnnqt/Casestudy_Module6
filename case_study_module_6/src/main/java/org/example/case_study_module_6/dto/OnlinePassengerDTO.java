package org.example.case_study_module_6.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class OnlinePassengerDTO {
    private String fullName;
    private String gender;          // "Nam", "Nữ", "Khác"
    private String email;
    private String phone;
    private String identityCard;    // CMND/Passport

    // Checkbox 1: "Là trẻ em đi kèm" (2-12 tuổi)
    private boolean isChild;

    // Checkbox 2: "Có kèm em bé" (< 2 tuổi - Đi cùng người lớn)
    private boolean hasInfant;
}