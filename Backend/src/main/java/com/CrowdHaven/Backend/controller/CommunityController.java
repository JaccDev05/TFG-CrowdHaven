package com.CrowdHaven.Backend.controller;


import com.CrowdHaven.Backend.DTOS.CommunityDTO;
import com.CrowdHaven.Backend.models.Community;
import com.CrowdHaven.Backend.services.CommunityService;
import com.CrowdHaven.Backend.services.MemberCommunityService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/communities")
@CrossOrigin("*")
@AllArgsConstructor
public class CommunityController {

    // http://localhost:8080/CrowdHaven/Communities

    private  final CommunityService communityService;
    private final MemberCommunityService memberCommunityService;

    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities() {
        return ResponseEntity.ok(this.communityService.getAllCommunities());
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Community> getCommunityById(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.getCommunityById(id).orElseThrow(
                () -> new IllegalArgumentException("Comunidad no encontrada")
        ));
    }

    @PostMapping("/create")
    public ResponseEntity<?> CreateCommunity(@RequestBody CommunityDTO communityDTO) {
        try {

            Community community = communityService.createCommunity(communityDTO);
            CommunityDTO response = new CommunityDTO
                    (community.getName(), community.getDescription(),
                            community.getImg_photo(), community.getImg_banner(), community.getUser().getUsername());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PutMapping("/update/{comId}")
    public ResponseEntity<Community> updateCommunity (@PathVariable Long comId, @RequestBody Community communityUp){
        return ResponseEntity.ok(communityService.updateCommunity(comId, communityUp));
    }

    @DeleteMapping("/delete/{id}")
    public  ResponseEntity<?> deleteCommunity (@PathVariable Long id) {
        this.communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Community>> getAllCommunitiesByUser(@PathVariable Long userId) {
        List<Community> communities = communityService.getAllCommunitiesByUser(userId);
        return ResponseEntity.ok(communities);
    }
}
