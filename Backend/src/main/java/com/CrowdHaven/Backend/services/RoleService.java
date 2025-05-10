package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.RoleDTO;
import com.CrowdHaven.Backend.models.Community;
import com.CrowdHaven.Backend.models.Role;
import com.CrowdHaven.Backend.repositories.CommunityRepository;
import com.CrowdHaven.Backend.repositories.RoleRepository;
import com.CrowdHaven.Backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;

    // Obtener todos los roles de una comunidad
    public List<Role> getRolesByCommunityId(Long communityId) {
        Optional<Community> communityOptional = this.communityRepository.findById(communityId);
        if (communityOptional.isEmpty()) {
            throw new IllegalArgumentException("Comunidad no encontrada");
        }


        return roleRepository.findByCommunityId(communityId);
    }



    public Role addRoleToCommunity(RoleDTO roleDTO) {
        Optional<Community> communityOptional = this.communityRepository.findByName(roleDTO.getCommunity());
        if (communityOptional.isEmpty()) {
            throw new IllegalArgumentException("Comunidad no encontrada");
        }

        Role role = new Role();
        role.setRoleName(roleDTO.getRoleName());
        role.setCommunity(communityOptional.get());

        return roleRepository.save(role);
    }

    public Role updateRole(Long id, RoleDTO roleDTO) {
        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado"));

        existingRole.setRoleName(roleDTO.getRoleName());

        return roleRepository.save(existingRole);
    }



    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}
