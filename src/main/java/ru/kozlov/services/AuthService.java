package ru.kozlov.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kozlov.dtos.AccountDto;
import ru.kozlov.dtos.SignUpDto;
import ru.kozlov.entities.Account;
import ru.kozlov.repositories.UserRepository;

import java.util.ArrayList;
import java.util.Random;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void saveNewUser(SignUpDto signUpDto) {
        var account = Account.builder()
                .name(signUpDto.name())
                .email(signUpDto.email())
                .password(passwordEncoder.encode(signUpDto.password()))
                .role("ROLE_USER")
                .color("green")
                .photo(String.valueOf((int) (Math.random() * 10)))
                .achievementList(new ArrayList<>());
        userRepository.save(account.build());
    }
}
