package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.CommunityDTO;
import com.CrowdHaven.Backend.models.Community;
import com.CrowdHaven.Backend.models.User;
import com.CrowdHaven.Backend.repositories.CommunityRepository;
import com.CrowdHaven.Backend.repositories.MemberCommunityRepository;
import com.CrowdHaven.Backend.repositories.RoleRepository;
import com.CrowdHaven.Backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private  final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MemberCommunityRepository memberCommunityRepository;


    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Optional<Community> getCommunityById(long id) {
        return this.communityRepository.findById(id);
    }

    public List<Community> getAllCommunitiesByUser(Long id) {
        return communityRepository.findByUserId(id);
    }

    public Community createCommunity(CommunityDTO communityFromFront) {

        if(this.communityRepository.existsByName(communityFromFront.getName())){
            throw new IllegalArgumentException("Ya existe una comunidad con este nombre");
        }

        Optional<User> optionalAdmin = this.userRepository.findByUsername(communityFromFront.getUser());
        if (optionalAdmin.isEmpty()) {
            throw new IllegalArgumentException("Usuario administrador no encontrado");
        }

        else {

            Community community = new Community();
            community.setName(communityFromFront.getName());
            community.setDescription(communityFromFront.getDescription());
            community.setImg_photo(communityFromFront.getImg_photo());
            community.setImg_banner(communityFromFront.getImg_banner());
            community.setUser(optionalAdmin.get());

            if (community.getMembers() == null) {
                community.setMembers(new ArrayList<>());
            }
            community.getMembers().add(optionalAdmin.get());
            //mod
            this.communityRepository.save(community);
            return community;
        }
    }

    public Community updateCommunity(Long id, Community comDetails) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comunidad no encontrado"));

        community.setName(comDetails.getName());
        community.setDescription(comDetails.getDescription());
        community.setImg_photo(comDetails.getImg_photo());
        community.setImg_banner(comDetails.getImg_banner());

        communityRepository.save(community);
        return community;
    }


    /*public Member_Community addMemberToCommunity(MemberCommunityDTO dto) {
        Long userId = Long.parseLong(dto.getUser());
        Long communityId = Long.parseLong(dto.getCommunity());

        User user = userRepository.findByUsername(dto.getUser())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Community community = communityRepository.findByName(dto.getCommunity())
                .orElseThrow(() -> new RuntimeException("Comunidad no encontrada"));

        Optional<Role> role = roleRepository.
                findByRoleNameAndCommunityId(dto.getRole_community(), community.getId());

        // Validación: comprobar si ya existe la relación
        Optional<Member_Community> existing = memberCommunityRepository.findByCommunityIdAndUserId(user.getId(), community.getId());
        if (existing.isPresent()) {
            throw new RuntimeException("El usuario ya es miembro de la comunidad");
        }

        Member_Community member = new Member_Community();
        member.setUser(user);
        member.setCommunity(community);
        member.setRole_Community(role.get());

        return memberCommunityRepository.save(member);
    }*/


    public void deleteCommunity(Long id) {
        communityRepository.deleteById(id);
    }
}

