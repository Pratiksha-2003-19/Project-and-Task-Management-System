package com.teamtask.manager.dto;

import com.teamtask.manager.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private Long id;
    private String token;
    private String name;
    private String email;
    private Role role;
}
