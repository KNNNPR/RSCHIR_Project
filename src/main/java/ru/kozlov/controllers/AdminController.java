package ru.kozlov.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kozlov.dtos.AccountDto;
import ru.kozlov.dtos.AchievementDto;
import ru.kozlov.dtos.UserAchievementDto;
import ru.kozlov.services.AchievementService;
import ru.kozlov.services.AdminService;
import ru.kozlov.services.UserService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AdminController {
    private final AdminService adminService;
    private final AchievementService achievementService;
    private final UserService userService;

    @PostMapping("/save-achievement")
    public HttpStatus addNewAchievement(@RequestBody AchievementDto achievement) {
        achievementService.saveNewAchievement(achievement);
        return HttpStatus.OK;
    }

    @PostMapping("/save-achievement/{id}")
    public HttpStatus editAchievement(@RequestBody AchievementDto achievement, @PathVariable long id) {
        achievementService.editAchievement(achievement, id);
        log.info(id + " achievement has been edited");
        return HttpStatus.OK;
    }

    @PostMapping("/delete-achievement")
    public HttpStatus deleteAchievement(@RequestBody long id) {
        adminService.deleteAchievement(id);
        return HttpStatus.OK;
    }

    @PostMapping("/add-user-achievement")
    public HttpStatus addAchievementForUser(@RequestBody UserAchievementDto userAchievementDto) {
        log.info(String.valueOf(userAchievementDto.achievementId()));
        adminService.addAchievementForUser(userAchievementDto);
        return HttpStatus.OK;
    }

    @PostMapping("/delete-achievement-from-user")
    public HttpStatus deleteAchievementFromUser(@RequestBody UserAchievementDto userAchievementDto) {
        adminService.deleteAchievementFromUser(userAchievementDto);
        return HttpStatus.OK;
    }

    @GetMapping("/get-all-users")
    public ResponseEntity<List<AccountDto>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllAccounts(), HttpStatus.OK);
    }

    @PostMapping("/get-user-info")
    public ResponseEntity<AccountDto> getUserInfo(@RequestBody long userId) {
        return new ResponseEntity<>(userService.findAccountById(userId), HttpStatus.OK);
    }
}
