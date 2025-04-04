package com.CrowdHaven.Backend.DTOS;

import com.CrowdHaven.Backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommunityDTO {

    private String name;
    private String description;
    private String img_photo;
    private String admin;

}
