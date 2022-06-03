package org.lamisplus.modules.base.domain.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@Table(name = "role_menu")
@IdClass(RoleMenuPK.class)
public class RoleMenu implements Serializable {
    @Column(name = "role_id")
    @Id
    private Long roleId;

    @Column(name = "menu_id")
    @Id
    private Long menuId;
}
