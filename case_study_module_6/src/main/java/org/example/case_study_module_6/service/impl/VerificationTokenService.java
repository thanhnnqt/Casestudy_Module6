package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.VerificationToken;
import org.example.case_study_module_6.repository.IVerificationTokenRepository;
import org.example.case_study_module_6.service.IVerificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class VerificationTokenService implements IVerificationTokenService {

    @Autowired
    private IVerificationTokenRepository repo;

    public VerificationToken create(Account account) {
        VerificationToken token = new VerificationToken();
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        return repo.save(token);
    }

    public VerificationToken validate(String tokenStr) {
        VerificationToken token = repo.findByToken(tokenStr)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token đã hết hạn");
        }
        return token;
    }

    @Override
    public void delete(VerificationToken vt) {
        repo.delete(vt);
    }

    @Override
    public VerificationToken createFromRegister(RegisterRequest req) {

        VerificationToken vt = new VerificationToken();
        vt.setToken(UUID.randomUUID().toString());
        vt.setRegisterRequest(req);
        vt.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        return repo.save(vt);
    }

}
