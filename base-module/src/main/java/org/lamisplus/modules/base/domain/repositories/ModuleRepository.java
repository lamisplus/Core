package org.lamisplus.modules.base.domain.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.lamisplus.modules.base.domain.entities.Module;

import java.util.List;
import java.util.Optional;

public interface ModuleRepository extends JpaRepository<Module, Long> {

    Optional<Module> findByName(String name);

    /*List<Module> findByProcessConfigIsTrue();

    List<Module> findByUninstallIsTrue();

    List<Module> findByActiveIsTrue();*/

    //List<Module> findByActiveIsTrueAndStartedIsTrue();

    //List<Module> findAllByStatusNot(int status);

    //Optional<Module> findByIdAndStatus(String id, int status);

    //List<Module> findAllByModuleType(int moduleType);

    List<Module> findByActiveIsTrueOrderByPriority();

    @Query("select m from Module m where m.active = true and m.inError = false")
    List<Module> findByActiveIsTrueAndInErrorIsFalse();

    @Query("select distinct m from Module m join m.webModules w where m.active = true and w.providesFor is not null")
    List<Module> findAllWithProviders();

    @Query("select distinct m from Module m join m.webModules w where m.active = true and w.providesFor is null")
    List<Module> findAllWithoutProviders();

    @Modifying
    @Query(value = "delete from base_form where module_id = ?1", nativeQuery = true)
    void deleteViewTemplates(Long moduleId);

    @Modifying
    @Query(value = "delete from base_menu where module_id = ?1", nativeQuery = true)
    void deleteMenus(Long moduleId);

    @Modifying
    @Query(value = "delete from base_menu where id = ?1", nativeQuery = true)
    void deleteMenu(Long menuId);

    @Modifying
    @Query(value = "delete from base_web_module where module_id = ?1", nativeQuery = true)
    void deleteWebModule(Long moduleId);

    @Modifying
    @Query(value = "delete from base_menu_authorities where menu_id = ?1", nativeQuery = true)
    void deleteMenuAuthorities(Long menuId);

    @Modifying
    @Query(value = "delete from base_authority where module_id = ?1", nativeQuery = true)
    void deleteAuthorities(Long moduleId);

    @Modifying
    @Query(value = "delete from base_module_dependencies where module_id = ?1", nativeQuery = true)
    void deleteDependency(Long moduleId);

    @Modifying
    @Query(value = "delete from base_module_artifact where module_id = ?1", nativeQuery = true)
    void deleteArtifact(Long moduleId);

    @Query(value = "SELECT * from base_module where name ilike ?1 Limit 1", nativeQuery = true)
    Optional<Module> findLikeByMenu(String moduleName);

    Optional<Module> findByNameAndVersionAndActive(String name, String version, boolean active);

    Optional<Module> findByNameAndActive(String name, boolean active);
}
