package org.lamisplus.modules.base.domain.repositories;


import org.lamisplus.modules.base.domain.entities.Menu;
import org.lamisplus.modules.base.domain.entities.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface MenuRepository extends JpaRepository<Menu, Long>, JpaSpecificationExecutor {

    Optional<Menu> findByIdAndArchived(Long id, int archive);

    List<Menu> findAllByArchivedOrderByIdDesc(int archived);

    Optional<Menu> findByName(String name);

    List<Menu> findByModuleId(Long moduleId);

    List<Menu> findByModuleAndLevel(Module module, String level);

    List<Menu> findByLevelAndParentName(String level, String name);

    List<Menu> findByModule(Module module);

    List<Menu> findAllByModuleId(Long moduleId);

    void deleteByModuleId(Long moduleId);

    List<Menu> findAllByArchivedAndParentIdOrderByIdDesc(int archived, Integer parentId);

    List<Menu> findAllByArchivedAndParentIdOrderByPositionAsc(int archived, Integer parentId);

    List<Menu> findAllByArchivedOrderByPositionAsc(int archived);
}
