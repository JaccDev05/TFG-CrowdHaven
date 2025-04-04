package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.RoleDTO;
import com.CrowdHaven.Backend.models.Role;
import com.CrowdHaven.Backend.repositories.CommunityRepository;
import com.CrowdHaven.Backend.repositories.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final CommunityRepository communityRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public List<Role> getRolesByUserID(Long userId) {
        return roleRepository.findByUserId(userId); // Llama al repositorio para obtener los productos
    }

    public Role createRole(RoleDTO roleDTO) {

        if (this.roleRepository.existsByRoleName(roleDTO.getRoleName())){
            throw new IllegalArgumentException("Role Already Exists");
        }

        else {
            /*RewardType type = this.rewardTypeRepository.findByRewTypeName(rewardFromFront.getType()).orElseThrow(
                    () -> new IllegalArgumentException("Role no permitido")
            );*/

            Role role = new Role();
            role.setRoleName(roleDTO.getRoleName());
            role.setCommunity(this.communityRepository.findByName(roleDTO.getCommunity()).get());

            this.roleRepository.save(role);
            return role;
        }
    }

    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}
