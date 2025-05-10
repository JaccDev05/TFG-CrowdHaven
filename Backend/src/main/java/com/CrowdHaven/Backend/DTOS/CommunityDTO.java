package com.CrowdHaven.Backend.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommunityDTO {

    private String name;
    private String description;
    private String img_photo;
    private String img_banner;
    private String user; //admin

}
