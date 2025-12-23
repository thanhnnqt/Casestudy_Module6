package org.example.case_study_module_6.dto;

public class UserPrincipal {

    private final Long accountId;
    private final String username;
    private final String role;
    private final Long customerId;

    public UserPrincipal(
            Long accountId,
            String username,
            String role,
            Long customerId
    ) {
        this.accountId = accountId;
        this.username = username;
        this.role = role;
        this.customerId = customerId;
    }

    public Long getAccountId() { return accountId; }
    public Long getCustomerId() { return customerId; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
}
