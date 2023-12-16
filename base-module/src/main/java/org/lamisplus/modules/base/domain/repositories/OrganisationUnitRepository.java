package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.CentralPartnerMapping;
import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrganisationUnitRepository extends JpaRepository<OrganisationUnit, Long> {
    List<OrganisationUnit> findAllOrganisationUnitByParentOrganisationUnitIdAndArchived(Long id, int archived);

    List<OrganisationUnit> findAllByParentOrganisationUnitIdAndOrganisationUnitLevelId(Long parentOrgUnitId, Long orgUnitLevelId);

    List<OrganisationUnit> findAllByOrganisationUnitLevelId(Long id);

    Optional<OrganisationUnit> findByNameAndParentOrganisationUnitIdAndArchived(String name, Long parentOrganisationUnitId, int archived);

    Optional<OrganisationUnit> findByIdAndArchived(Long id, int archived);

    Page<OrganisationUnit> findAllByArchivedOrderByIdAsc(int unarchived, Pageable pageable);

    List<OrganisationUnit> findAllByOrganisationUnitLevelIdIn(List<Long> organisationUnitLevelId);

    @Query(value = "SELECT id from base_organisation_unit WHERE name ilike ?1" +
            " AND description ilike '%local%'AND " +
            "parent_organisation_unit_id = (SELECT id from base_organisation_unit WHERE name = ?2 " +
            "AND organisation_unit_level_id=2)", nativeQuery = true)
    Long findByOrganisationDetails(String parentOrganisationUnitName, String parentsParentOrganisationUnitName);

    @Query(value = "SELECT name FROM base_organisation_unit WHERE organisation_unit_level_id=2", nativeQuery = true)
    List<String> findAllState();

    @Query(value = "SELECT name FROM base_organisation_unit WHERE organisation_unit_level_id=3", nativeQuery = true)
    List<String> findAllProvince();

    @Query(value = "select * from base_organisation_unit org where  org.id in (select distinct ps.organisation_unit_id from patient ps)", nativeQuery = true)
    List<OrganisationUnit> findOrganisationUnitWithRecords();

    //TODO: optimized to only give necessary fields ie id and name
    @Query(value = "SELECT * FROM base_organisation_unit ou WHERE ou.organisation_unit_level_id = ?1 " +
            "AND ou.archived = ?2", nativeQuery = true)
    List<OrganisationUnit> findByOrganisationsByLevelAndArchived(Long organisationUnitLevelId, int archived);

    @Query(value = "SELECT * FROM base_organisation_unit ou WHERE ou.name ilike ?1 " +
            "AND parent_organisation_unit_id=?2 AND organisation_unit_level_id=?3 AND ou.archived = ?4", nativeQuery = true)
    Optional<OrganisationUnit> findLikeOrganisationUnit(String name, long parentOrganisationUnitId, Integer level, int archived);

    @Query(value = "SELECT * FROM base_organisation_unit ou WHERE ou.name ilike ?1 " +
            "AND organisation_unit_level_id=?2 AND ou.archived = ?3", nativeQuery = true)
    Optional<OrganisationUnit> findLikeOrganisationUnitInState(String name, Integer level, int archived);

    @Query(value = "SELECT id, facility_name AS facilityName FROM central_partner_mapping WHERE ip_code=?1",
            nativeQuery = true)
    List<CentralPartnerMapping> findByOrgUnitInIp(Long orgUnit);

}
