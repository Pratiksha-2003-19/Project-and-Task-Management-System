package com.teamtask.manager.service;

import com.teamtask.manager.model.Project;
import com.teamtask.manager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository repository;

    public List<Project> findAll() {
        return repository.findAll();
    }

    public Project save(Project project) {
        return repository.save(project);
    }

    public Project findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    @Transactional
    public Project update(Long id, Project project) {
        Project existingProject = findById(id);
        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        existingProject.setOwner(project.getOwner());
        existingProject.setTeamMembers(project.getTeamMembers());
        return repository.save(existingProject);
    }

    @Transactional
    public Project markAsCompleted(Long id) {
        Project project = findById(id);
        project.setCompleted(true);
        return repository.save(project);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}