package org.lamisplus.modules.base.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.lamisplus.modules.base.domain.entities.Audit;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@EqualsAndHashCode
@NoArgsConstructor
@RequiredArgsConstructor
public class Permission extends Audit<String> {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String name;

    private String description;

    private int archived;

    /*@ManyToOne
    @JsonIgnore
    private Menu menu;*/

    /*@OneToMany(mappedBy = "permissionByPermissionId")
    @ToString.Exclude
    @JsonIgnore
    public List<RolePermission> rolePermissionsById;*/

    @PrePersist
    public void update(){
        archived = 0;
        name = description.replace(" ", "_") + "_"+ LocalDateTime.now();
    }
}
