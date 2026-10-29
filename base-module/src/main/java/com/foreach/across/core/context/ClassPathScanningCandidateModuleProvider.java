package com.foreach.across.core.context;

import com.foreach.across.core.AcrossModule;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.module.ModuleUtils;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.type.filter.AssignableTypeFilter;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

@Slf4j
public class ClassPathScanningCandidateModuleProvider {
    private final ApplicationContext applicationContext;

    public ClassPathScanningCandidateModuleProvider(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public Map<String, Supplier<AcrossModule>> findCandidateModules(String... basePackages) {
        Map<String, Supplier<AcrossModule>> candidates = new LinkedHashMap<>();
        if (basePackages == null) {
            return candidates;
        }
        ClassLoader cl = ModuleUtils.getModuleClassLoader();
        ClassPathScanningCandidateComponentProvider scanner =
                new ClassPathScanningCandidateComponentProvider(false);
        scanner.setResourceLoader(new DefaultResourceLoader(cl));
        scanner.addIncludeFilter(new AssignableTypeFilter(AcrossModule.class));

        for (String basePackage : basePackages) {
            if (basePackage == null || basePackage.trim().isEmpty()) {
                continue;
            }
            Set<BeanDefinition> definitions = scanner.findCandidateComponents(basePackage);
            for (BeanDefinition bd : definitions) {
                try {
                    Class<?> clazz = Class.forName(bd.getBeanClassName(), true, cl);
                    if (AcrossModule.class.isAssignableFrom(clazz)) {
                        AcrossModule instance = (AcrossModule) clazz.getDeclaredConstructor().newInstance();
                        candidates.put(instance.getName(), () -> instance);
                    }
                } catch (Exception e) {
                    LOG.error("Failed to instantiate AcrossModule candidate {}: {}", bd.getBeanClassName(), e.getMessage());
                }
            }
        }
        return candidates;
    }
}
