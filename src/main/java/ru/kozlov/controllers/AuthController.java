package ru.kozlov.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.kozlov.dtos.SignUpDto;
import ru.kozlov.services.AuthService;


@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/sign-up")
    public HttpStatus registerUser(@RequestBody SignUpDto signUpDto) {
        authService.saveNewUser(signUpDto);
        return HttpStatus.OK;
    }
}
