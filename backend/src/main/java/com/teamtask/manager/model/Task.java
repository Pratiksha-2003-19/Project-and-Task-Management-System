package com.teamtask.manager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    public enum Status {
        TODO, IN_PROGRESS, COMPLETED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH
    }
}
