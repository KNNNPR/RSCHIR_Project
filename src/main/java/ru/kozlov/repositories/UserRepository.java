package ru.kozlov.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.kozlov.entities.Account;


@Repository
public interface UserRepository extends JpaRepository<Account, Long> {
    Account findByEmail(String email);
    Account findById(long id);
}
