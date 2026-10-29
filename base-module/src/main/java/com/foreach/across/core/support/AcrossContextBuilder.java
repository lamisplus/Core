package com.foreach.across.core.support;

import com.foreach.across.core.AcrossContext;
import com.foreach.across.core.AcrossModule;
import org.springframework.context.ApplicationContext;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class AcrossContextBuilder {
    private ApplicationContext applicationContext;
    private DataSource dataSource;
    private DataSource installerDataSource;
    private final List<AcrossModule> modules = new ArrayList<>();

    public AcrossContextBuilder applicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
        return this;
    }

    public AcrossContextBuilder dataSource(DataSource dataSource) {
        this.dataSource = dataSource;
        return this;
    }

    public AcrossContextBuilder installerDataSource(DataSource installerDataSource) {
        this.installerDataSource = installerDataSource;
        return this;
    }

    public AcrossContextBuilder modules(AcrossModule... modules) {
        if (modules != null) {
            this.modules.addAll(Arrays.asList(modules));
        }
        return this;
    }

    public AcrossContext build() {
        AcrossContext context = new AcrossContext(applicationContext);
        context.setDataSource(dataSource);
        context.setInstallerDataSource(installerDataSource != null ? installerDataSource : dataSource);
        for (AcrossModule module : modules) {
            context.addModule(module);
        }
        return context;
    }
}
