package org.lamisplus.modules.base;

import com.foreach.across.core.AcrossContext;
import com.foreach.across.core.context.AcrossApplicationContextHolder;
import com.foreach.across.core.context.configurer.ApplicationContextConfigurer;
import com.foreach.across.core.filters.BeanFilter;
import com.foreach.across.core.installers.InstallerSettings;
import com.foreach.across.core.transformers.ExposedBeanDefinitionTransformer;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;

import java.util.Properties;
import java.util.Set;

import static org.mockito.Mockito.*;

class BaseModuleTest {
    @Mock
    Logger LOG;
    @Mock
    Set<ApplicationContextConfigurer> applicationContextConfigurers;
    @Mock
    Set<ApplicationContextConfigurer> installerContextConfigurers;
    @Mock
    Set<String> runtimeDependencies;
    @Mock
    AcrossContext context;
    @Mock
    BeanFilter exposeFilter;
    @Mock
    ExposedBeanDefinitionTransformer exposeTransformer;
    @Mock
    InstallerSettings installerSettings;
    @Mock
    AcrossApplicationContextHolder acrossApplicationContextHolder;
    @Mock
    Properties properties;
    @InjectMocks
    BaseModule baseModule;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testGetDescription() {
        String result = baseModule.getDescription();
        Assertions.assertEquals("Module containing LAMISPlus", result);
    }
}
