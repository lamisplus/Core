package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.Role;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor {

    @EntityGraph(attributePaths = "permission")
    Optional<Role> findByName(String name);
//
//    @EntityGraph(attributePaths = "permission")
//    Optional<Role> findById(Long id);

    List<Role> findAllByArchived(int archived);

    @Query(value = "SELECT * FROM roles WHERE name in (?1) AND archived=0", nativeQuery = true)
    List<Role> findAllInRolesNames(Set<String> names);


}
