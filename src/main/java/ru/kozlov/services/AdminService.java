package ru.kozlov.services;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kozlov.dtos.UserAchievementDto;
import ru.kozlov.entities.Account;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {
    private final UserService userService;
    private final AchievementService achievementService;
    private final PasswordEncoder passwordEncoder;

    public void addAchievementForUser(UserAchievementDto achievementDto) {
        var achievement = achievementService.getAchievementById(achievementDto.achievementId());
        var user = userService.getAccountById(achievementDto.userId());
        user.getAchievementList().add(achievement);
        achievement.getAccountList().add(user);
        userService.saveAccount(user);
        achievementService.saveAchievement(achievement);
    }

    public void deleteAchievement(long id) {
        achievementService.deleteAchievementById(id);
    }

    public void deleteAchievementFromUser(UserAchievementDto achievementDto) {
        var achievement = achievementService.getAchievementById(achievementDto.achievementId());
        var user = userService.getAccountById(achievementDto.userId());
        user.getAchievementList().remove(achievement);
        achievement.getAccountList().remove(user);
        userService.saveAccount(user);
        achievementService.saveAchievement(achievement);
    }

    @PostConstruct
    public void createDefaultUser() {
        if (userService.getAccountById(1) == null) {
            Account account = new Account(1, "0@ru",
                    passwordEncoder.encode("admin"), "admin", "ROLE_ADMIN", "green", "0", new ArrayList<>());
            userService.saveAccount(account);
        }
    }
}
