package ru.kozlov.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String email;
    private String password;
    private String name;
    private String role;
    private String color;
    private String photo;
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "accountList")
    private List<Achievement> achievementList;
}
