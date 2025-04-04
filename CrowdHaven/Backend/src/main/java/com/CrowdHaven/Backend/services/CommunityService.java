package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.CommunityDTO;
import com.CrowdHaven.Backend.models.Community;
import com.CrowdHaven.Backend.models.Member_Community;
import com.CrowdHaven.Backend.models.User;
import com.CrowdHaven.Backend.repositories.CommunityRepository;
import com.CrowdHaven.Backend.repositories.MemberCommunityRepository;
import com.CrowdHaven.Backend.repositories.RoleRepository;
import com.CrowdHaven.Backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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

    /*public List<Community> getAllCommunitiesbyUser(Long id) {
        return communityRepository.findByUserID(id);
    }

    /*public List<User> getAllUsersByCommunity(String name) {
        return userRepository.findByCommunity(name);
    }
    public List<Community> getCommunitiesByUserId(Long userId) {
        List<Member_Community> memberships = memberCommunityRepository.findByUserId(userId);
        return memberships.stream().map(Member_Community::getCommunity).toList();
    }*/

    public Community updateCommunity(Long id, Community comDetails) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comunidad no encontrado"));

        community.setName(comDetails.getName());
        community.setDescription(comDetails.getDescription());
        community.setImg_photo(comDetails.getImg_photo());
        community.setImg_banner(comDetails.getImg_banner());
        community.setRoles(comDetails.getRoles());

        return communityRepository.save(community);
    }

    public Optional<Community> getCommunityById(long id) {
        return this.communityRepository.findById(id);
    }

    public Community createCommunityById(CommunityDTO communityFromFront) {

        if(this.communityRepository.existsByName(communityFromFront.getName())){
            throw new IllegalArgumentException("Ya existe una comunidad con este nombre");
        }

        else {


            Community community = new Community();
            community.setName(communityFromFront.getName());
            community.setDescription(communityFromFront.getDescription());
            community.setImg_photo(communityFromFront.getImg_photo());
            community.setAdmin(this.userRepository.findByUsername(communityFromFront.getAdmin()).get());

            this.communityRepository.save(community);
            return community;
        }
    }

    public void deleteCommunity(Long id) {
        communityRepository.deleteById(id);
    }
}

