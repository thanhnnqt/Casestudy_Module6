package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.Account;

public interface IJwtService {
    String generateToken(Account account);

    String extractUsername(String token);

    boolean isTokenValid(String token);
}
