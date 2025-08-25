package org.lamisplus.modules.base.module;

import lombok.Data;
import org.lamisplus.modules.base.domain.entities.Module;

import java.io.Serializable;

@Data
public class ModuleResponse implements Serializable {
    public enum Type {ERROR, SUCCESS}

    private Type type;
    private String message;
    private Module module;
}
