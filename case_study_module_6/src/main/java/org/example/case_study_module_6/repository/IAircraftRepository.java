package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Aircraft;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IAircraftRepository extends JpaRepository<Aircraft, Integer> {
    List<Aircraft> findByAirlineId(Integer airlineId);
}
