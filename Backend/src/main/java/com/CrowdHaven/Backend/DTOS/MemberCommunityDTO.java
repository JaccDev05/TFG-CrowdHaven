package com.CrowdHaven.Backend.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class MemberCommunityDTO {
    private Long userId;
    private Long communityId;
    private Long roleId;

}
