package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.RolePermission;
import org.lamisplus.modules.base.domain.entities.RolePermissionPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {

    Optional<RolePermission> findByRolePermissionPK(RolePermissionPK permissionPK);

    List<RolePermission> findAllByRolePermissionPKContaining(Long roleId);

    void deleteByRolePermissionPKContaining(Long roleId);
}
