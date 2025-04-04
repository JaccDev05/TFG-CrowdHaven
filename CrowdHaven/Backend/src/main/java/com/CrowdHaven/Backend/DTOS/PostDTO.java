package com.CrowdHaven.Backend.DTOS;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class PostDTO {

    private String user;
    private String Community;
    private String title;
    private String content;
    private String image;
}
