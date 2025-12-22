package org.example.case_study_module_6.repository;


import org.example.case_study_module_6.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAirportRepository extends JpaRepository<Airport, Integer> {}
