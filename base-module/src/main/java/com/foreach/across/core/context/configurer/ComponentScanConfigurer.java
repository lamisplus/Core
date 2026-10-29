package com.foreach.across.core.context.configurer;

import java.util.Arrays;

public class ComponentScanConfigurer implements ApplicationContextConfigurer {
    private final String[] packageNames;

    public ComponentScanConfigurer(String... packageNames) {
        this.packageNames = packageNames != null ? packageNames : new String[0];
    }

    public ComponentScanConfigurer(Class<?>... packageClasses) {
        if (packageClasses == null) {
            this.packageNames = new String[0];
        } else {
            this.packageNames = Arrays.stream(packageClasses)
                    .map(c -> c.getPackage().getName())
                    .toArray(String[]::new);
        }
    }

    @Override
    public String[] getComponentScanPackages() {
        return packageNames;
    }
}
