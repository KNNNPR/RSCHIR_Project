package ru.kozlov.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kozlov.dtos.AchievementDto;
import ru.kozlov.entities.Achievement;
import ru.kozlov.repositories.AchievementRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AchievementService {
    private final AchievementRepository achievementRepository;

    public void saveAchievement(Achievement achievement) {
        achievementRepository.save(achievement);
    }

    public void editAchievement(AchievementDto achievementDto, long id) {
        var achievement = achievementRepository.findById(id);
       achievement.setName(achievementDto.name());
       achievement.setDescription(achievementDto.description());
       achievement.setExp(achievementDto.exp());
       achievementRepository.save(achievement);
    }

    public void saveNewAchievement(AchievementDto achievementDto) {
        saveAchievement(Achievement.builder()
                .name(achievementDto.name())
                .description(achievementDto.description())
                .exp(achievementDto.exp())
                .build());
    }

    public List<AchievementDto> getAllAchievements() {
        var achievements = achievementRepository.findAll();
        List<AchievementDto> achievementDtos = new ArrayList<>();
        for (Achievement achievement: achievements) {
            achievementDtos.add(parseAchievement(achievement));
        }
        return achievementDtos;
    }

    public Achievement getAchievementById(long id) {
        return achievementRepository.findById(id);
    }

    private AchievementDto parseAchievement(Achievement achievement) {
        return new AchievementDto(
                achievement.getId(),
                achievement.getName(),
                achievement.getDescription(),
                achievement.getExp()
        );
    }

    public void deleteAchievementById(long id) {
        achievementRepository.deleteById(id);
    }
}
