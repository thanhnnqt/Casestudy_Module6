package org.example.case_study_module_6.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirlinePieItemDTO {
    private String name;
    private long value; // doanh thu
}
