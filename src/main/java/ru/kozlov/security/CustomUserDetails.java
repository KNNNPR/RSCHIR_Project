package ru.kozlov.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ru.kozlov.entities.Account;

import java.util.Collection;
import java.util.List;

@AllArgsConstructor
@Getter
@Slf4j
public class CustomUserDetails implements UserDetails {
    private Account account;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (account == null)
            return List.of();
        return List.of(new CustomRole(account.getRole()));
    }

    @Override
    public String getPassword() {
        if (account == null)
            return "";
        return account.getPassword();
    }

    @Override
    public String getUsername() {
        if (account == null)
            return "";
        return account.getEmail();
    }
}
