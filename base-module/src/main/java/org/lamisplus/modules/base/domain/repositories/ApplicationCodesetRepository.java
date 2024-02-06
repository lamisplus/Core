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


    List<ApplicationCodeSet> findAllByArchivedOrderByIdAsc(int archived);

    List<ApplicationCodeSet> findAllByArchivedNotOrderByIdAsc(int archived);

    @Query(value = "SELECT DISTINCT(display) AS display, id, codeset_group, language, version, " +
            "code, date_created, created_by, date_modified, modified_by, archived FROM base_application_codeset " +
            "WHERE codeset_group=?1 AND archived=?2", nativeQuery = true)
    List<ApplicationCodeSet> findAllByCodesetGroupAndArchivedOrderByIdAsc(String codeSetGroup, int archived);

    @Query(value = "SELECT display FROM base_application_codeset WHERE codeset_group='GENDER'", nativeQuery = true)
    List<String> findAllGender();

    List<ApplicationCodeSet> findAllByCodeAndArchived(String code, int archived);


        @Modifying
        @Transactional
        @Query(value = "INSERT INTO public.base_application_codeset " +
                "(id, codeset_group, display, language, version, code, date_created, created_by, " +
                "date_modified, modified_by, archived) " +
                "VALUES (:id, :codesetGroup, :display, :language, :version, :code, :dateCreated, " +
                ":createdBy, :dateModified, :modifiedBy, :archived) " +
                "ON CONFLICT (code) DO UPDATE SET " +
                "codeset_group = EXCLUDED.codeset_group, display = EXCLUDED.display, " +
                "language = EXCLUDED.language, version = EXCLUDED.version, code = EXCLUDED.code",
                nativeQuery = true)
        List<ApplicationCodeSet> insertOrUpdateAll (List<ApplicationCodeSet> applicationCodeSets);


}
