package com.CrowdHaven.Backend.DTOS;

import com.CrowdHaven.Backend.models.Community;
import com.CrowdHaven.Backend.models.Role;
import com.CrowdHaven.Backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberCommunityDTO {

    private String user;
    private String community;
    private String role_Community;
    private double crowdCoin ;

}
