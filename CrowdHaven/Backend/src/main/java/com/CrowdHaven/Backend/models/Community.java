package com.CrowdHaven.Backend.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.util.ArrayList;
import java.util.List;

import java.time.LocalDateTime;

@Entity
@Table(name = "communities")
@Data
public class Community {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private String img_photo;

    private String img_banner;

    @OneToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "community", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Role> roles = new ArrayList<>();

}
