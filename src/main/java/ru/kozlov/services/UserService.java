package ru.kozlov.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.kozlov.dtos.AccountDto;
import ru.kozlov.dtos.AchievementDto;
import ru.kozlov.entities.Account;
import ru.kozlov.entities.Achievement;
import ru.kozlov.repositories.UserRepository;
import ru.kozlov.security.CustomUserDetailsService;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final CustomUserDetailsService service;
    @PersistenceContext
    private final EntityManager entityManager;

    @Transactional
    public AccountDto getAccountInfo() {
        var user = entityManager.find(Account.class, service.getCurrentUser().getAccount().getId());
        if (user == null) {
            throw new EntityNotFoundException("User not found");
        }
        user = entityManager.merge(user);
        entityManager.refresh(user);
        return new AccountDto(user.getId(), user.getName(), user.getEmail(), user.getColor(), user.getPhoto());
    }

    public AccountDto findAccountById(long id) {
        var user = userRepository.findById(id);
        return new AccountDto(user.getId(), user.getName(), user.getEmail(), user.getColor(), user.getPhoto());
    }

    public List<AchievementDto> getAccountAchievements(long id) {
        var achievements = userRepository.findById(id).getAchievementList();
        if (achievements == null)
            return new ArrayList<>();
        List<AchievementDto> achievementDtoList = new ArrayList<>();
        for (Achievement iter: achievements) {
            var achievement = new AchievementDto(iter.getId(),
                    iter.getName(), iter.getDescription(), iter.getExp());
            achievementDtoList.add(achievement);
        }
        return achievementDtoList;
    }

    public Account getAccountById(long id) {
        return userRepository.findById(id);
    }

    public void saveAccount(Account account) {
        userRepository.save(account);
    }

    public List<AccountDto> getAllAccounts() {
        var accounts = userRepository.findAll();
        List<AccountDto> accountDtoList = new ArrayList<>();
        for (Account account: accounts) {
            accountDtoList.add(new AccountDto(account.getId(), account.getName(), account.getEmail(),
                    account.getColor(), account.getPhoto()));
        }
        return accountDtoList;
    }

    @Transactional
    public void saveChanges(AccountDto accountDto) {
        var account = getAccountById(accountDto.id());
        account.setName(accountDto.username());
        account.setColor(accountDto.color());
        account.setPhoto(accountDto.photo());
        entityManager.flush();
        entityManager.clear();
    }
}
