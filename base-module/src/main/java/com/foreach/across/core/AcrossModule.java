package com.foreach.across.core;

import com.foreach.across.core.context.configurer.ApplicationContextConfigurer;

import java.util.*;

public abstract class AcrossModule {
    private final List<ApplicationContextConfigurer> applicationContextConfigurers = new ArrayList<>();
    private final Set<String> runtimeDependencies = new LinkedHashSet<>();

    public AcrossModule() {
    }

    public abstract String getName();

    public String getDescription() {
        return "Module containing LAMISPlus";
    }

    public void addApplicationContextConfigurer(ApplicationContextConfigurer... configurers) {
        if (configurers != null) {
            Collections.addAll(this.applicationContextConfigurers, configurers);
        }
    }

    public List<ApplicationContextConfigurer> getApplicationContextConfigurers() {
        return Collections.unmodifiableList(applicationContextConfigurers);
    }

    public void addRuntimeDependency(String... moduleNames) {
        if (moduleNames != null) {
            Collections.addAll(this.runtimeDependencies, moduleNames);
        }
    }

    public Set<String> getRuntimeDependencies() {
        return Collections.unmodifiableSet(runtimeDependencies);
    }

    public Object[] getInstallers() {
        return new Object[0];
    }
}
