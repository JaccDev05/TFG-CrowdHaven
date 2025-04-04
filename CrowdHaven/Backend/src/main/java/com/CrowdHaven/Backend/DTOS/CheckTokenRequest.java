package com.CrowdHaven.Backend.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckTokenRequest {
    private String username;
    private String token;
}
