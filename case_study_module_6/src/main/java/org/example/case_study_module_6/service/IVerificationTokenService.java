package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.VerificationToken;

public interface IVerificationTokenService {
    VerificationToken create(Account account);
    VerificationToken validate(String tokenStr);
}
