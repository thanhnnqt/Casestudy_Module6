package org.example.case_study_module_6.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeePieChartDTO {
    private String title; // "Tháng 3/2025" | "Quý 1" | "Năm 2025"
    private List<EmployeePieItemDTO> data;
}
