package org.example.case_study_module_6.controller;
import org.example.case_study_module_6.entity.Aircraft;
import org.example.case_study_module_6.entity.Airline;
import org.example.case_study_module_6.entity.Airport;
import org.example.case_study_module_6.repository.IAircraftRepository;
import org.example.case_study_module_6.repository.IAirlineRepository;
import org.example.case_study_module_6.repository.IAirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/master") // API Prefix quan trọng
@CrossOrigin(origins = "http://localhost:5173") // Fix lỗi CORS
public class MasterDataController {

    @Autowired private IAirportRepository IAirportRepository;
    @Autowired private IAirlineRepository IAirlineRepository;
    @Autowired private IAircraftRepository IAircraftRepository;

    @GetMapping("/airports")
    public List<Airport> getAllAirports() { return IAirportRepository.findAll(); }

    @GetMapping("/airlines")
    public List<Airline> getAllAirlines() { return IAirlineRepository.findAll(); }

    @GetMapping("/aircrafts/{airlineId}")
    public List<Aircraft> getAircraftsByAirline(@PathVariable Integer airlineId) {
        return IAircraftRepository.findByAirlineId(airlineId);
    }
}