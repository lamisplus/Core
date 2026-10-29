package com.foreach.across.config;

import com.foreach.across.core.AcrossContext;
import com.foreach.across.core.installers.AcrossInstallerRunner;
import com.foreach.across.modules.web.mvc.PrefixingRequestMappingHandlerMapping;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseModule;
import org.lamisplus.modules.base.module.ModuleUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcRegistrations;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.sql.DataSource;

@Slf4j
@Configuration
public class AcrossBootstrapConfig {

    private final PrefixingRequestMappingHandlerMapping prefixingHandlerMapping =
            new PrefixingRequestMappingHandlerMapping();

    @Bean
    public static BeanFactoryPostProcessor acrossClassLoaderBeanFactoryPostProcessor() {
        return new BeanFactoryPostProcessor() {
            @Override
            public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
                beanFactory.setBeanClassLoader(ModuleUtils.getModuleClassLoader());
                if (beanFactory.containsBeanDefinition("entityManagerFactory")) {
                    BeanDefinition bd = beanFactory.getBeanDefinition("entityManagerFactory");
                    bd.setDependsOn("acrossContext");
                }
            }
        };
    }

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties primaryDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "dataSource")
    @Primary
    @ConfigurationProperties("spring.datasource.hikari")
    public DataSource primaryDataSource() {
        return primaryDataSourceProperties()
                .initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }

    @Bean
    public AcrossContext acrossContext(ApplicationContext applicationContext, DataSource dataSource) {
        AcrossInstallerRunner.runInstallers(
                BaseModule.NAME,
                "org.lamisplus.modules.base",
                dataSource,
                ModuleUtils.getModuleClassLoader()
        );
        AcrossContext context = new AcrossContext(applicationContext);
        context.setDataSource(dataSource);
        context.setInstallerDataSource(dataSource);
        context.addModule(new BaseModule());
        context.bootstrap();
        return context;
    }

    /**
     * The prefixing mapping is supplied to Spring MVC only through {@link WebMvcRegistrations}, so Spring
     * registers it exactly once as the "requestMappingHandlerMapping" bean. Exposing the same instance as a
     * second bean would initialise it twice and register every controller method twice (ambiguous mappings).
     */
    @Bean
    public WebMvcRegistrations acrossWebMvcRegistrations() {
        return new WebMvcRegistrations() {
            @Override
            public RequestMappingHandlerMapping getRequestMappingHandlerMapping() {
                return prefixingHandlerMapping;
            }
        };
    }
}
