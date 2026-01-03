package org.example.case_study_module_6.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopChartDTO {
    List<String> labels;
    List<Double> data;
    String unit;
}
