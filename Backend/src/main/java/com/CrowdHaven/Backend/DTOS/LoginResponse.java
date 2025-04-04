package com.CrowdHaven.Backend.DTOS;

import lombok.Data;

@Data

public class LoginResponse {
    private String token;
    private String username;
}
