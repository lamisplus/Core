package org.lamisplus.restart;

import com.foreach.across.core.AcrossModule;
import com.foreach.across.core.context.configurer.ApplicationContextConfigurer;
import com.foreach.across.core.context.configurer.ComponentScanConfigurer;

public class RestartModule extends AcrossModule {
    public static final String NAME = "RestartModule";

    public RestartModule() {
        this.addApplicationContextConfigurer(new ApplicationContextConfigurer[]
                {new ComponentScanConfigurer(new String[]{this.getClass().getPackage().getName() + ".controller"})});
    }

    public String getName() {
        return NAME;
    }
}