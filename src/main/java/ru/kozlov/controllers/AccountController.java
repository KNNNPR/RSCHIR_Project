package ru.kozlov.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.kozlov.dtos.AccountDto;
import ru.kozlov.dtos.AchievementDto;
import ru.kozlov.services.AchievementService;
import ru.kozlov.services.UserService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AccountController {
    private final UserService service;
    private final AchievementService achievementService;
    private final UserService userService;

    @GetMapping("/load-user-data")
    public ResponseEntity<AccountDto> getUserData() {
        return new ResponseEntity<>(service.getAccountInfo(), HttpStatus.OK);
    }

    @PostMapping("/load-user-achievements")
    public ResponseEntity<List<AchievementDto>> getUserAchievements(@RequestBody long id) {
        return new ResponseEntity<>(service.getAccountAchievements(id), HttpStatus.OK);
    }

    @GetMapping("/load-all-achievements")
    public ResponseEntity<List<AchievementDto>> getAllAchievements() {
        return new ResponseEntity<>(achievementService.getAllAchievements(), HttpStatus.OK);
    }

    @PostMapping("/save-changes")
    public HttpStatus saveChanges(@RequestBody AccountDto accountDto) {
        log.info("here");
        userService.saveChanges(accountDto);
        return HttpStatus.OK;
    }
}
