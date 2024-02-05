package org.lamisplus.modules.base.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(3)
@Installer(name = "core-schema-updates", description = "Updates the required database tables data",
        version = 18)
public class Updates extends AcrossLiquibaseInstaller {
    public Updates() {
        super("classpath:installers/base/schema/updates.xml");
    }
}
