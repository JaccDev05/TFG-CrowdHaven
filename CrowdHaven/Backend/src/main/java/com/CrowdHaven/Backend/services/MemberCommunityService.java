package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.models.Community;
import com.CrowdHaven.Backend.models.Member_Community;
import com.CrowdHaven.Backend.models.User;
import com.CrowdHaven.Backend.repositories.MemberCommunityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MemberCommunityService {

    private final MemberCommunityRepository memberCommunityRepository;

    public List<User> getUsersByCommunity(Community community) {
        return memberCommunityRepository.findByCommunity(community)
                .stream()
                .map(Member_Community::getUser)
                .toList();
    }

    public List<Community> getCommunitiesByUserId(Long userId) {
        List<Member_Community> memberships = memberCommunityRepository.findByUserId(userId);
        return memberships.stream().map(Member_Community::getCommunity).toList();
    }
}
