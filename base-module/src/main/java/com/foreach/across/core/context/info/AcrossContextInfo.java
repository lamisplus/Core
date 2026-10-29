package com.foreach.across.core.context.info;

import org.springframework.context.ApplicationContext;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class AcrossContextInfo {
    private final ApplicationContext applicationContext;
    private final List<AcrossModuleInfo> modules;

    public AcrossContextInfo(ApplicationContext applicationContext, List<AcrossModuleInfo> modules) {
        this.applicationContext = applicationContext;
        this.modules = modules != null ? modules : Collections.emptyList();
    }

    public ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    public Collection<AcrossModuleInfo> getModules() {
        return Collections.unmodifiableList(modules);
    }
}
