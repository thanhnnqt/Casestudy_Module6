package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Passenger; // Import đúng Entity Passenger
import org.springframework.data.jpa.repository.JpaRepository;

// SỬA: Phải là JpaRepository<Passenger, Long>
public interface IPassengerRepository extends JpaRepository<Passenger, Long> {
}