package org.example.case_study_module_6.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeePieItemDTO {
    private String name;     // Tên nhân viên hoặc "Khác"
    private long value;      // Số booking
}
