package org.lamisplus.modules.base.domain.entities;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@Table(name = "role_permission")
//@IdClass(RolePermissionPK.class)
public class RolePermission{
//    @Column(name = "role_id")
//    @Id
//    private Long roleId;
//
//    @Column(name = "permission_id")
//    @Id
//    private Long permissionId;
    @EmbeddedId
    RolePermissionPK rolePermissionPK;
}
