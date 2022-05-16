package org.lamisplus.modules.base.domain.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;

@Data
@EqualsAndHashCode
@Embeddable
public class RolePermissionPK implements Serializable {
    //@Id
    @Column(name = "role_id")
    private Long roleId;

   // @Id
    @Column(name = "permission_id")
    private Long permissionId;

}
