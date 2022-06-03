package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.RoleMenu;
import org.lamisplus.modules.base.domain.entities.RoleMenuPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleMenuRepository extends JpaRepository<RoleMenu, Long> {

    /*Optional<RoleMenu> findByRoleMenuPK(RoleMenuPK roleMenuPK);

    List<RoleMenu> findAllByRoleMenuPKContaining(Long roleId);

    void deleteByRoleMenuPKContaining(Long roleId);

    @Query(value = "SELECT * FROM role_menu WHERE id in (?1)", nativeQuery = true)
    List<RoleMenu> findAllInRolesId(List<Long> roleId);*/
}
