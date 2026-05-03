package com.teamtask.manager.controller;

import com.teamtask.manager.model.User;
import com.teamtask.manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository repository;

    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        // Return all users so Admin can assign tasks
        return ResponseEntity.ok(repository.findAll());
    }
}
