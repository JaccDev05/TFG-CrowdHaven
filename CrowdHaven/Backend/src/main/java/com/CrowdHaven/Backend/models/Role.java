package com.CrowdHaven.Backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "roles")
@Data
public class Role {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String roleName;

    @ManyToOne
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;
}
