package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITicketRepository extends JpaRepository<Ticket, Long> {
}
