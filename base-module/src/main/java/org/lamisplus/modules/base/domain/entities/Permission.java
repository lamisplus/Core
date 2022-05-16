package org.lamisplus.modules.base.domain.entities;

import lombok.*;
import org.lamisplus.modules.base.domain.entities.Audit;

import javax.persistence.*;

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

    /*@OneToMany(mappedBy = "permissionByPermissionId")
    @ToString.Exclude
    @JsonIgnore
    public List<RolePermission> rolePermissionsById;*/
}
