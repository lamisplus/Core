package org.lamisplus.modules.base.domain.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(of = "id")
@ToString(of = "name")
@Table(name = "module_version_update")
@Entity
public class ModuleVersionUpdate implements Serializable, Persistable<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String currentVersion;

    private String previousVersion;

    private String releaseNotes;

    @NotNull
    private LocalDate releaseDate;

    @Override
    public boolean isNew() {
        return id == null;
    }
}
