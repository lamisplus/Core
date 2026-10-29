package com.foreach.across.core.context.configurer;

public interface ApplicationContextConfigurer {
    default String[] getComponentScanPackages() {
        return new String[0];
    }
}
