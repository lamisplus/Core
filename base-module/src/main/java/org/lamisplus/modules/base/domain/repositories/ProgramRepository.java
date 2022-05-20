package org.lamisplus.modules.base.domain.repositories;


import org.lamisplus.modules.base.domain.entities.Program;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository extends JpaRepository<Program, String> {
}
