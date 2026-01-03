package org.example.case_study_module_6.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompareResponseDTO {
    private List<String> labels;
    private List<Double> main;
    private List<Double> compare;
    private String unit;
    private String message;

    public static CompareResponseDTO noData() {
        CompareResponseDTO dto = new CompareResponseDTO();
        dto.setMessage("Không có dữ liệu so sánh");
        return dto;
    }

    public static CompareResponseDTO of(
            List<String> labels, List<Double> main,
            List<Double> compare, String unit) {
        return new CompareResponseDTO(labels, main, compare, unit, null);
    }
}
