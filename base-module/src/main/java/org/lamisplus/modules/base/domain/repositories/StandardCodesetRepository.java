package org.lamisplus.modules.base.domain.repositories;


import org.lamisplus.modules.base.domain.entities.StandardCodeset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StandardCodesetRepository extends JpaRepository<StandardCodeset, Long>, JpaSpecificationExecutor {

    Optional<StandardCodeset> findByIdAndAndArchived(Long id, int archive);

    List<StandardCodeset> findAllByStandardCodesetSourceIdAndArchived(Long standardCodesetSourceId, int archive);

    Optional<StandardCodeset> findByCodeAndAndArchived(String code, int archived);

    List<StandardCodeset> findAllByArchivedOrderByIdDesc(int archived);
}
