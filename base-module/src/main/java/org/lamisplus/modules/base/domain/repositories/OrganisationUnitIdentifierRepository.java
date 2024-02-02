package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.OrganisationUnitIdentifier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrganisationUnitIdentifierRepository extends JpaRepository<OrganisationUnitIdentifier, Long> {

    @Query(value = "SELECT * FROM base_organisation_unit_identifier " +
            "WHERE organisation_unit_id = ?1 AND name = ?2 " +
            "LIMIT 1", nativeQuery = true)
    Optional<OrganisationUnitIdentifier> findByOrganisationUnitIdAndIsDatimId(
            @Param("organisationUnitId") Long organisationUnitId,
            @Param("name") String name);

}
