package org.lamisplus.modules.base.yml;

import lombok.Data;
import org.lamisplus.modules.base.yml.Permission;

import java.util.Set;

@Data
public class Role {
    Set<Permission> permissions;
    private String name;
    private String authority;
    private String description;
}
