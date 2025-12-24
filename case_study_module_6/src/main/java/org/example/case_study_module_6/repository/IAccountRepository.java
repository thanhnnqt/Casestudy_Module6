package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface IAccountRepository extends JpaRepository<Account, Long> {

    // 1. Tìm theo username (Giữ nguyên)
    Optional<Account> findByUsername(String username);

    // 2. ĐÃ XÓA: findByEmail (Vì entity không còn field email)

    // 3. Kiểm tra username tồn tại (Giữ nguyên)
    boolean existsByUsername(String username);

    // 4. ĐÃ XÓA: existsByEmail

    // 5. Sửa lại Query: Bỏ đoạn "OR a.email = :identifier" đi
    // Chỉ còn tìm theo username thôi
    @Query("SELECT a FROM Account a WHERE a.username = :identifier")
    Optional<Account> findByIdentifier(@Param("identifier") String identifier);
}