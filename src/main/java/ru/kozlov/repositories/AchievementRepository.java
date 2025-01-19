package ru.kozlov.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.kozlov.entities.Achievement;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    Achievement findById(long id);
}
