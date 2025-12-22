package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Airline;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAirlineRepository extends JpaRepository<Airline, Integer> {}
