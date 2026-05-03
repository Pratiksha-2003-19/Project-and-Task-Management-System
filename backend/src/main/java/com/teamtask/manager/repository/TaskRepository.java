package com.teamtask.manager.repository;

import com.teamtask.manager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedUserId(Long userId);
    List<Task> findByProjectId(Long projectId);
}
