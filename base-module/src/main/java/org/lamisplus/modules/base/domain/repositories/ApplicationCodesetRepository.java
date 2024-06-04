package org.lamisplus.modules.base.domain.repositories;


import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationCodesetRepository extends JpaRepository<ApplicationCodeSet, Long>, JpaSpecificationExecutor {

    Optional<ApplicationCodeSet> findByDisplayAndCodesetGroup(String display, String codeSetGroup);

     ApplicationCodeSet findByDisplay(String display);

    Boolean existsByDisplayAndCodesetGroup(String display, String codesetGroup);

    Optional<ApplicationCodeSet> findByDisplayAndCodesetGroupAndArchived(String display, String codesetGroup, Integer active);

    Optional<ApplicationCodeSet> findByIdAndArchived(Long id, int archive);

    Optional<ApplicationCodeSet> findByIdAndArchivedNot(Long id, int archive);


    List<ApplicationCodeSet> findAllByOrderByIdAsc();

    List<ApplicationCodeSet> findAllByArchivedNotOrderByIdAsc(int archived);

    @Query(value = "SELECT DISTINCT(display) AS display, id, codeset_group, language, version, " +
            "code, date_created, created_by, date_modified, modified_by, archived FROM base_application_codeset " +
            "WHERE codeset_group=?1 AND archived=?2", nativeQuery = true)
    List<ApplicationCodeSet> findAllByCodesetGroupAndArchivedOrderByIdAsc(String codeSetGroup, int archived);

    @Query(value = "SELECT display FROM base_application_codeset WHERE codeset_group='GENDER'", nativeQuery = true)
    List<String> findAllGender();

    List<ApplicationCodeSet> findAllByCodeAndArchived(String code, int archived);

    Optional<ApplicationCodeSet> findByCode (String code);

}
