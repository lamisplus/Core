package org.lamisplus.modules.base.domain.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Id;
import java.io.Serializable;

@Data
@EqualsAndHashCode
@Embeddable
public class RoleMenuPK implements Serializable {
    @Id
    @Column(name = "role_id")
    private Long roleId;

    @Id
    @Column(name = "menu_id")
    private Long menuId;

}
