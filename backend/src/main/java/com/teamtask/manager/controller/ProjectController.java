package com.teamtask.manager.controller;

import com.teamtask.manager.model.Project;
import com.teamtask.manager.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService service;

    @GetMapping
    public ResponseEntity<List<Project>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Project> save(@RequestBody Project project) {
        return ResponseEntity.ok(service.save(project));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Project> update(@PathVariable Long id, @RequestBody Project project) {
        return ResponseEntity.ok(service.update(id, project));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Project> markAsCompleted(@PathVariable Long id) {
        return ResponseEntity.ok(service.markAsCompleted(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}