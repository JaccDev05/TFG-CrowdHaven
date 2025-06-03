package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.MemberCommunityDTO;
import com.CrowdHaven.Backend.models.Community;
import com.CrowdHaven.Backend.models.Member_Community;
import com.CrowdHaven.Backend.models.Role;
import com.CrowdHaven.Backend.models.User;
import com.CrowdHaven.Backend.repositories.CommunityRepository;
import com.CrowdHaven.Backend.repositories.MemberCommunityRepository;
import com.CrowdHaven.Backend.repositories.RoleRepository;
import com.CrowdHaven.Backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MemberCommunityService {

    private final MemberCommunityRepository memberCommunityRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private  final RoleRepository roleRepository;

    public List<User> getMembersByCommunityId(Long communityId) {

        List<Member_Community> miembros = memberCommunityRepository.findByCommunityId(communityId);
        List<User> users = miembros.stream().map(Member_Community::getUser).toList();

        return users;
    }

    public List<Community> getCommunitiesByUserId(Long userId) {
        List<Member_Community> miembros = memberCommunityRepository.findByUserId(userId);

        List <Community> communities = miembros.stream().map(Member_Community::getCommunity).toList();

        return communities;

    }


    public Member_Community addMemberToCommunity(MemberCommunityDTO dto) {
        User user = userRepository.findById( dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Community community = communityRepository.findById(dto.getCommunityId())
                .orElseThrow(() -> new IllegalArgumentException("Comunidad no encontrada"));

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado"));

        Member_Community member = new Member_Community();
        member.setUser(user);
        member.setCommunity(community);
        member.setRole(role);
        community.getMembers().add(user);

        return memberCommunityRepository.save(member);
    }


    public Member_Community assignRoleToMember(Long userId, Long communityId, Long roleId) {

        Member_Community member = memberCommunityRepository
                .findByUserIdAndCommunityId(userId, communityId)
                .orElseThrow(() -> new IllegalArgumentException("El miembro no existe en la comunidad"));

        Role role = this.roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado"));

        member.setRole(role);
        return memberCommunityRepository.save(member);
    }

    public List<Member_Community> getRolesMember(Long userId) {
        List<Member_Community> misRoles = memberCommunityRepository.findByUserId(userId);
        return misRoles;
    }

    public Member_Community getMember(Long userId, Long communityId) {
        Member_Community member = memberCommunityRepository
                .findByUserIdAndCommunityId(userId, communityId)
                .orElseThrow(() -> new IllegalArgumentException("El miembro no existe en la comunidad"));

        return member;
    }


    @Transactional
    public void removeUserFromCommunity(Long userId, Long communityId) {
        // Buscamos el miembro específico de la comunidad con userId y communityId

        // Eliminamos el miembro encontrado
        memberCommunityRepository.deleteByUserIdAndCommunityId(userId, communityId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        Community community = communityRepository.findById(communityId).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        community.getMembers().remove(user);
    }


}
