package org.lamisplus.modules.base.domain.repositories;


import org.lamisplus.modules.base.domain.entities.StandardCodesetSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StandardCodesetSourceRepository extends JpaRepository<StandardCodesetSource, Long>, JpaSpecificationExecutor {

    Optional<StandardCodesetSource> findByIdAndAndArchived(Long id, int archive);

    List<StandardCodesetSource> findAllByArchivedOrderByIdDesc(int archived);
}
