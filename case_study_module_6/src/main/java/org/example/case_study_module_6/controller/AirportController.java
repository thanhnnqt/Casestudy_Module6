package org.example.case_study_module_6.controller;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.entity.Airport;
import org.example.case_study_module_6.repository.IAirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AirportController {

    private final IAirportRepository airportRepository;

    @GetMapping
    public ResponseEntity<List<Airport>> getAllAirports() {
        return ResponseEntity.ok(airportRepository.findAll());
    }
}
