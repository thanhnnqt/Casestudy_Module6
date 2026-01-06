package org.example.case_study_module_6.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirlinePieChartDTO {
    private String title;
    private List<AirlinePieItemDTO> data;
}
