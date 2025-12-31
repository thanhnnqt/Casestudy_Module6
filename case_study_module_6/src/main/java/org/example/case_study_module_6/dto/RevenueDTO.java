package org.example.case_study_module_6.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueDTO {
    private LocalDate date;
    private Double revenue;
}
