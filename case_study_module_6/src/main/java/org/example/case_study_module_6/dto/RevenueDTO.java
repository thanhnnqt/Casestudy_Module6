package org.example.case_study_module_6.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueDTO {
    private List<String> labels;
    private List<Long> main;
    private List<Long> compare;
    private String unit = "VND";
}
