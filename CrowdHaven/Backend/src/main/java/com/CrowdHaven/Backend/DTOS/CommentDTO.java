package com.CrowdHaven.Backend.DTOS;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommentDTO {

    private String user;
    private String community;
    private Long post_Id;
    private String content;

}
