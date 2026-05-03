package com.teamtask.manager.controller;

import com.teamtask.manager.model.Task;
import com.teamtask.manager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService service;

    @GetMapping
    public ResponseEntity<List<Task>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> findByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(service.findByProject(projectId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> findByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.findByUser(userId));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Task> save(@RequestBody Task task) {
        return ResponseEntity.ok(service.save(task));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable Long id, @RequestParam Task.Status status) {
        Task task = service.findById(id);
        task.setStatus(status);
        return ResponseEntity.ok(service.save(task));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
