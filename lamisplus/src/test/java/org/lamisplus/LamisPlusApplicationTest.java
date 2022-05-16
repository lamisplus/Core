package test.java.org.lamisplus;

import com.foreach.across.config.AcrossContextConfigurer;
import com.foreach.across.core.AcrossContext;
import com.foreach.across.core.installers.InstallerAction;
import com.foreach.across.core.installers.InstallerSettings;
import com.foreach.across.modules.web.AcrossWebModule;
import com.foreach.across.test.AcrossTestConfiguration;
import com.foreach.across.test.AcrossTestContext;
import com.foreach.across.test.AcrossWebAppConfiguration;
import com.foreach.across.test.support.AcrossTestBuilders;
import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.lamisplus.modules.base.BaseModule;
import org.lamisplus.modules.base.installers.SchemaInstaller;
import org.lamisplus.modules.base.installers.SchemaInstallerInsert;
import org.lamisplus.modules.base.service.MenuService;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith({SpringExtension.class, MockitoExtension.class})
@DirtiesContext
@ContextConfiguration
@AcrossWebAppConfiguration
@AutoConfigureEmbeddedDatabase(beanName = "acrossDataSource", provider = AutoConfigureEmbeddedDatabase.DatabaseProvider.ZONKY)
@TestExecutionListeners({
        DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class,
        TransactionalTestExecutionListener.class
})
@Slf4j
class LamisPlusApplicationTest {


//    @Test
//    public void baseModuleShouldBootstrapInIsolation() {
//        try (AcrossTestContext context = AcrossTestBuilders.standard (true)
//                .modules (new BaseModule ())
//                .build ()) {
//             assertNotNull( context.getBeanOfType( MenuService.class ) );
//        }
//    }


//    @Configuration
//    @AcrossTestConfiguration(modulePackages = "org.lamisplus.modules.base")
//    @PropertySource(value = "classpath:across-test.properties")
//    static class Config {
//    }

}
