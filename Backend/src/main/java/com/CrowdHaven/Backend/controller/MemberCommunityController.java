package com.CrowdHaven.Backend.controller;

import com.CrowdHaven.Backend.DTOS.MemberCommunityDTO;
import com.CrowdHaven.Backend.models.Community;
import com.CrowdHaven.Backend.models.Member_Community;
import com.CrowdHaven.Backend.models.User;
import com.CrowdHaven.Backend.services.MemberCommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberCommunityController {

    private final MemberCommunityService memberCommunityService;

    // Ver todos los usuarios de una comunidad
    @GetMapping("/community/{communityId}")
    public List<User> getUsersByCommunity(@PathVariable Long communityId) {
        return memberCommunityService.getMembersByCommunityId(communityId);
    } //ya

    // Ver todas las comunidades de un usuario
    @GetMapping("/user/{userId}")
    public List<Community> getCommunitiesByUser(@PathVariable Long userId) {
        return memberCommunityService.getCommunitiesByUserId(userId);
    }

    // Añadir usuario a comunidad
    @PostMapping
    public Member_Community addUserToCommunity(@RequestBody MemberCommunityDTO memberCommunityDTO) {
        return memberCommunityService.addMemberToCommunity(memberCommunityDTO);
    }

    // Eliminar usuario de comunidad
    @DeleteMapping("/{userId}/{comId}")
    public void removeUserFromCommunity(@PathVariable Long userId, @PathVariable Long comId) {
        memberCommunityService.removeUserFromCommunity(userId, comId);
    }

    @PutMapping("/{userId}/{comId}/{roleId}")
    public ResponseEntity<Member_Community> assignRoleToMember(
            @PathVariable Long userId,
            @PathVariable Long comId,
            @PathVariable Long roleId
    ) {
        Member_Community updatedMember = memberCommunityService.assignRoleToMember(userId, comId, roleId);
        return ResponseEntity.ok(updatedMember);
    }
}
