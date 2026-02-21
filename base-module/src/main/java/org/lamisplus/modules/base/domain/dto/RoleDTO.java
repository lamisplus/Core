package org.lamisplus.modules.base.domain.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.lamisplus.modules.base.domain.entities.Menu;
import org.lamisplus.modules.base.domain.entities.Permission;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
@ToString
public class RoleDTO {
    private Long id;
    @NotBlank(message = "name is mandatory")
    private String name;
    private String code;
    private List<Permission> permissions;
    private String excludeRoles;
    private List<Menu> menus;
}
