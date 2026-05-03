package com.teamtask.manager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "TaskFlow Backend is running!");
        response.put("database", "H2 (in-memory)");
        return response;
    }
    
    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("service", "TaskFlow Backend API");
        response.put("status", "running");
        response.put("version", "1.0.0");
        return response;
    }
}
