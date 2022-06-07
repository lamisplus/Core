package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.RoleMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleMenuRepository extends JpaRepository<RoleMenu, Long> {
}
