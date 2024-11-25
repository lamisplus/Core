package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.Role;
import org.lamisplus.modules.base.domain.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findOneByUserName(String userName);

    Optional<User> findOneByUserNameOrEmail(String userName, String email);

    @EntityGraph(attributePaths = "role")
    Optional<User> findOneWithRoleByUserName(String userName);

    Page<User> findAll(Pageable pageable);

    List<User> findAllByRoleIn(HashSet<Role> roles);

    Page<User> findAllByArchived(Pageable pageable, int archived);

    List<User> findAllByArchived(int archived);

    Optional<User> findByIdAndArchived(Long id, int archived);

    @Query(value = "SELECT count(*) FROM public.base_application_user where current_organisation_unit_id !=100000 and archived != '1'", nativeQuery = true)
    Integer getAllByArchived();

    @Query(value = "SELECT count(*) FROM public.base_application_user_organisation_unit where application_user_id=?1 and organisation_unit_id=?2", nativeQuery = true)
    Integer getUsersByOrganisationId(Long userId, Long orgId);
}
