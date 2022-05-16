package org.lamisplus.modules.base.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(2)
@Installer(name = "schema-installer-insert", description = "Insert the required database tables data", version = 1)
public class SchemaInstallerInsert extends AcrossLiquibaseInstaller {
    public SchemaInstallerInsert() {
        super("classpath:installers/base/schema/insert-schema-1.0.xml");
    }
}
