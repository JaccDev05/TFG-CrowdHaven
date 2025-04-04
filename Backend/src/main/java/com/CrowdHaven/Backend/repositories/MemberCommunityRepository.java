package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.Community;
import com.CrowdHaven.Backend.models.Member_Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberCommunityRepository extends JpaRepository<Member_Community, Long> {
    List<Member_Community> findByCommunity(Community community);
    List<Member_Community> findByUserId(Long userId);

}
