package com.CrowdHaven.Backend.controller;

import com.CrowdHaven.Backend.DTOS.RoleDTO;
import com.CrowdHaven.Backend.models.Role;
import com.CrowdHaven.Backend.services.RoleService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@AllArgsConstructor

public class RoleController {

    private final RoleService roleService;

    // Obtener todos los roles de una comunidad por su ID
    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<Role>> getRolesByCommunity(@PathVariable Long communityId) {
        return ResponseEntity.ok(roleService.getRolesByCommunityId(communityId));
    }

    // Añadir rol a una comunidad
    @PostMapping
    public ResponseEntity<RoleDTO> addRoleToCommunity(@RequestBody RoleDTO roleDTO) {
        Role role = roleService.addRoleToCommunity(roleDTO);
        RoleDTO response = new RoleDTO(role.getRoleName(), role.getCommunity().getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        Role updatedRole = roleService.updateRole(id, roleDTO);
        return ResponseEntity.ok(updatedRole);
    }

    // Eliminar rol
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}

