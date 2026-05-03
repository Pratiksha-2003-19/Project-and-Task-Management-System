package com.teamtask.manager.service;

import com.teamtask.manager.model.Task;
import com.teamtask.manager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repository;

    public List<Task> findAll() {
        return repository.findAll();
    }

    public List<Task> findByProject(Long projectId) {
        return repository.findByProjectId(projectId);
    }

    public List<Task> findByUser(Long userId) {
        return repository.findByAssignedUserId(userId);
    }

    public Task save(Task task) {
        return repository.save(task);
    }

    public Task findById(Long id) {
        return repository.findById(id).orElseThrow();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
