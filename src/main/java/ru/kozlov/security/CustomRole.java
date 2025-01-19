package ru.kozlov.security;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@AllArgsConstructor
@Getter
public class CustomRole implements GrantedAuthority {
    private String role;
    @Override
    public String getAuthority() {
        return role;
    }
}
