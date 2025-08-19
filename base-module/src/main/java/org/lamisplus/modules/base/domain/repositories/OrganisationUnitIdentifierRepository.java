package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.OrganisationUnitIdentifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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


    @Query(value = "SELECT boui.code, bou.name, boui.id, boui.organisation_unit_id  FROM base_organisation_unit_identifier boui " +
            "JOIN base_organisation_unit bou ON bou.id = boui.organisation_unit_id " +
            "WHERE boui.code ILIKE :search OR bou.name ILIKE :search ", nativeQuery = true)
    Page<OrganisationUnitIdentifier> searchOrganisationUnitsPage(String search, Pageable pageable);

}
