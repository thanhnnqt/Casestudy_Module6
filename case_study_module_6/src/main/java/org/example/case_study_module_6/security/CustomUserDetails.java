//package org.example.case_study_module_6.security;
//
//import org.example.case_study_module_6.entity.Account;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.Collection;
//import java.util.List;
//
//public class CustomUserDetails implements UserDetails {
//
//    private final Account account;
//
//    public CustomUserDetails(Account account) {
//        this.account = account;
//    }
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of(
//                new SimpleGrantedAuthority(
//                        "ROLE_" + account.getRole().getName().name()
//                )
//        );
//    }
//
//    @Override
//    public String getPassword() {
//        return account.getPassword();
//    }
//
//    @Override
//    public String getUsername() {
//        return account.getUsername();
//    }
//
//    // 🔥 QUAN TRỌNG
//    @Override
//    public boolean isEnabled() {
//        return account.isEnabled(); // false => KHÔNG login được
//    }
//
//    @Override public boolean isAccountNonExpired() { return true; }
//    @Override public boolean isAccountNonLocked() { return true; }
//    @Override public boolean isCredentialsNonExpired() { return true; }
//}
