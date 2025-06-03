package com.CrowdHaven.Backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "roles")
@Data

public class Role {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roleName;

    @ManyToOne
    @JoinColumn(name = "community_id", nullable = false)
    @JsonIgnoreProperties("roles") // evita recursividad de community -> roles -> community
    private Community community;

}
