package com.foreach.across.core.context.info;

import com.foreach.across.core.AcrossModule;
import org.springframework.context.ApplicationContext;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

public class AcrossModuleInfo {
    private final AcrossModule module;
    private final ApplicationContext applicationContext;
    private final Map<String, ExposedBeanDefinition> exposedBeanDefinitions = new LinkedHashMap<>();

    public AcrossModuleInfo(AcrossModule module, ApplicationContext applicationContext) {
        this.module = module;
        this.applicationContext = applicationContext;
    }

    public String getName() {
        return module.getName();
    }

    public AcrossModule getModule() {
        return module;
    }

    public ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    public Map<String, ExposedBeanDefinition> getExposedBeanDefinitions() {
        return Collections.unmodifiableMap(exposedBeanDefinitions);
    }

    public void addExposedBeanDefinition(String beanName, ExposedBeanDefinition definition) {
        this.exposedBeanDefinitions.put(beanName, definition);
    }
}
