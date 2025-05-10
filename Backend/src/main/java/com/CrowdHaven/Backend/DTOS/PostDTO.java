package com.CrowdHaven.Backend.DTOS;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class PostDTO {

    private Long userId;
    private Long communityId;
    private String title;
    private String content;
    private String image;
}
