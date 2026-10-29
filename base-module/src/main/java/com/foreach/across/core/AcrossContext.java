package com.foreach.across.core;

import com.foreach.across.core.annotations.Exposed;
import com.foreach.across.core.context.configurer.ApplicationContextConfigurer;
import com.foreach.across.core.context.info.AcrossContextInfo;
import com.foreach.across.core.context.info.AcrossModuleInfo;
import com.foreach.across.core.context.info.ExposedBeanDefinition;
import com.foreach.across.core.installers.AcrossInstallerRunner;
import com.foreach.across.modules.hibernate.provider.HibernatePackageConfigurer;
import com.foreach.across.modules.hibernate.provider.HibernatePackageRegistry;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.module.ModuleMapModifierProvider;
import org.lamisplus.modules.base.module.ModuleUtils;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.beans.factory.support.GenericBeanDefinition;
import org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy;
import org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.type.filter.AssignableTypeFilter;
import org.springframework.data.repository.Repository;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.util.ClassUtils;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.*;

@Slf4j
@Getter
@Setter
public class AcrossContext {
    private static final Set<String> ACCUMULATED_ENTITY_PACKAGES = Collections.synchronizedSet(new LinkedHashSet<>(
            Collections.singletonList("org.lamisplus.modules.base.domain")
    ));

    private ApplicationContext parentApplicationContext;
    private DataSource dataSource;
    private DataSource installerDataSource;
    private final List<AcrossModule> modules = new ArrayList<>();
    private final List<AcrossModuleInfo> moduleInfos = new ArrayList<>();
    private AcrossContextInfo contextInfo;
    private ConfigurableApplicationContext childApplicationContext;

    public AcrossContext() {
        this.contextInfo = new AcrossContextInfo(null, moduleInfos);
    }

    public AcrossContext(ApplicationContext parentApplicationContext) {
        this.parentApplicationContext = parentApplicationContext;
        this.contextInfo = new AcrossContextInfo(parentApplicationContext, moduleInfos);
    }

    public void addModule(AcrossModule module) {
        if (module != null) {
            this.modules.add(module);
        }
    }

    public Collection<AcrossModule> getModules() {
        return Collections.unmodifiableList(modules);
    }

    public AcrossModule getModule(String name) {
        for (AcrossModule module : modules) {
            if (name != null && name.equals(module.getName())) {
                return module;
            }
        }
        return null;
    }

    public ApplicationContext getApplicationContext() {
        return childApplicationContext != null ? childApplicationContext : parentApplicationContext;
    }

    public void bootstrap() {
        ClassLoader moduleClassLoader = ModuleUtils.getModuleClassLoader();
        Thread.currentThread().setContextClassLoader(moduleClassLoader);

        if (parentApplicationContext instanceof ConfigurableApplicationContext) {
            ConfigurableApplicationContext configurableParent = (ConfigurableApplicationContext) parentApplicationContext;
            configurableParent.getBeanFactory().setBeanClassLoader(moduleClassLoader);
        }

        for (AcrossModule module : modules) {
            if (module == null || "AcrossHibernateJpaModule".equals(module.getName()) || "AcrossWebModule".equals(module.getName())) {
                continue;
            }
            if ("BaseModule".equals(module.getName()) || "RestartModule".equals(module.getName())) {
                AcrossModuleInfo info = new AcrossModuleInfo(module, parentApplicationContext);
                moduleInfos.add(info);
                continue;
            }
            bootstrapChildModule(module, moduleClassLoader);
        }
        this.contextInfo = new AcrossContextInfo(getApplicationContext(), moduleInfos);
    }

    private void bootstrapChildModule(AcrossModule module, ClassLoader classLoader) {
        String moduleName = module.getName();
        String basePackage = module.getClass().getPackage().getName();
        DataSource targetInstallerDs = installerDataSource != null ? installerDataSource : dataSource;

        // 1. Run Liquibase installers
        AcrossInstallerRunner.runInstallers(moduleName, basePackage, targetInstallerDs, classLoader);

        // 2. Discover HibernatePackageConfigurer implementations in module
        final Set<String> packagesToScanSet = new LinkedHashSet<>();
        packagesToScanSet.add("org.lamisplus.modules.base.domain");
        synchronized (ACCUMULATED_ENTITY_PACKAGES) {
            packagesToScanSet.addAll(ACCUMULATED_ENTITY_PACKAGES);
        }
        packagesToScanSet.add(basePackage + ".domain");

        HibernatePackageRegistry packageRegistry = new HibernatePackageRegistry() {
            @Override
            public void addPackageToScan(Class<?>... packageClasses) {
                if (packageClasses != null) {
                    for (Class<?> c : packageClasses) {
                        if (c != null && c.getPackage() != null) {
                            packagesToScanSet.add(c.getPackage().getName());
                        }
                    }
                }
            }

            @Override
            public void addPackageToScan(String... packageNames) {
                if (packageNames != null) {
                    for (String pkg : packageNames) {
                        if (pkg != null && !pkg.trim().isEmpty()) {
                            packagesToScanSet.add(pkg.trim());
                        }
                    }
                }
            }
        };

        ClassPathScanningCandidateComponentProvider extScanner =
                new ClassPathScanningCandidateComponentProvider(false);
        extScanner.setResourceLoader(new DefaultResourceLoader(classLoader));
        extScanner.addIncludeFilter(new AssignableTypeFilter(HibernatePackageConfigurer.class));
        Set<BeanDefinition> extCandidates = extScanner.findCandidateComponents(basePackage);
        for (BeanDefinition bd : extCandidates) {
            try {
                Class<?> cfgClass = Class.forName(bd.getBeanClassName(), true, classLoader);
                HibernatePackageConfigurer configurer =
                        (HibernatePackageConfigurer) cfgClass.getDeclaredConstructor().newInstance();
                configurer.configureHibernatePackage(packageRegistry);
            } catch (Exception e) {
                LOG.warn("Could not invoke HibernatePackageConfigurer {}: {}", bd.getBeanClassName(), e.getMessage());
            }
        }

        synchronized (ACCUMULATED_ENTITY_PACKAGES) {
            ACCUMULATED_ENTITY_PACKAGES.addAll(packagesToScanSet);
        }

        // 3. Create child AnnotationConfigApplicationContext for the module
        AnnotationConfigApplicationContext childCtx = new AnnotationConfigApplicationContext();
        childCtx.setParent(parentApplicationContext);
        childCtx.setClassLoader(classLoader);
        childCtx.setResourceLoader(new DefaultResourceLoader(classLoader));
        childCtx.setAllowBeanDefinitionOverriding(true);
        childCtx.getBeanFactory().setBeanClassLoader(classLoader);

        // 4. Register module EntityManagerFactory and TransactionManager if DataSource is available
        if (dataSource != null) {
            String[] packagesToScan = packagesToScanSet.toArray(new String[0]);
            LocalContainerEntityManagerFactoryBean emfBean = new LocalContainerEntityManagerFactoryBean();
            emfBean.setDataSource(dataSource);
            emfBean.setPackagesToScan(packagesToScan);
            emfBean.setPersistenceUnitName(moduleName);
            HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
            emfBean.setJpaVendorAdapter(vendorAdapter);

            Map<String, Object> jpaProps = new HashMap<>();
            jpaProps.put("hibernate.physical_naming_strategy", SpringPhysicalNamingStrategy.class.getName());
            jpaProps.put("hibernate.implicit_naming_strategy", SpringImplicitNamingStrategy.class.getName());
            jpaProps.put("hibernate.temp.use_jdbc_metadata_defaults", "false");
            jpaProps.put("hibernate.dialect", parentApplicationContext.getEnvironment()
                    .getProperty("spring.jpa.properties.hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect"));
            jpaProps.put("hibernate.enable_lazy_load_no_trans", "true");
            emfBean.setJpaPropertyMap(jpaProps);
            emfBean.setBeanClassLoader(classLoader);
            emfBean.afterPropertiesSet();

            EntityManagerFactory emf = emfBean.getObject();
            childCtx.registerBean("entityManagerFactory", EntityManagerFactory.class, () -> emf);

            JpaTransactionManager txManager = new JpaTransactionManager(emf);
            childCtx.registerBean("transactionManager", JpaTransactionManager.class, () -> txManager);
        }

        // 5. Collect packages to scan from ApplicationContextConfigurers
        Set<String> scanPackages = new LinkedHashSet<>();
        for (ApplicationContextConfigurer configurer : module.getApplicationContextConfigurers()) {
            if (configurer != null && configurer.getComponentScanPackages() != null) {
                for (String pkg : configurer.getComponentScanPackages()) {
                    if (pkg != null && !pkg.startsWith("org.lamisplus.modules.base")
                            && !pkg.startsWith("org.springframework.web.socket")) {
                        scanPackages.add(pkg);
                    }
                }
            }
        }
        if (scanPackages.isEmpty()) {
            scanPackages.add(basePackage);
        }

        childCtx.scan(scanPackages.toArray(new String[0]));
        childCtx.refresh();
        this.childApplicationContext = childCtx;

        // 6. Populate AcrossModuleInfo and expose module beans to parent BeanFactory for ContextProvider & cross-module injection
        AcrossModuleInfo moduleInfo = new AcrossModuleInfo(module, childCtx);
        DefaultListableBeanFactory parentFactory = getParentDefaultListableBeanFactory();

        for (String beanName : childCtx.getBeanDefinitionNames()) {
            if (beanName.startsWith("org.springframework.")) {
                continue;
            }
            try {
                Object beanInstance = childCtx.getBean(beanName);
                if (beanInstance == null) {
                    continue;
                }
                Class<?> userClass = ClassUtils.getUserClass(beanInstance.getClass());
                Class<?> exposedType = resolveExposedType(childCtx, beanName, beanInstance, userClass);
                boolean shouldExpose = isExposableBean(beanInstance, userClass, exposedType);

                if (shouldExpose) {
                    String targetBeanName = parentFactory != null && !parentFactory.containsBeanDefinition(beanName)
                            ? beanName
                            : moduleName + ":" + beanName;
                    moduleInfo.addExposedBeanDefinition(targetBeanName, new ExposedBeanDefinition(targetBeanName, exposedType));
                    if (parentFactory != null) {
                        parentFactory.setAllowBeanDefinitionOverriding(true);
                        GenericBeanDefinition gbd = new GenericBeanDefinition();
                        gbd.setBeanClass(exposedType);
                        gbd.setScope(BeanDefinition.SCOPE_SINGLETON);
                        gbd.setInstanceSupplier(() -> beanInstance);
                        parentFactory.registerBeanDefinition(targetBeanName, gbd);
                    }
                }
            } catch (Exception e) {
                LOG.debug("Skipping exposure of bean {} in module {}: {}", beanName, moduleName, e.getMessage());
            }
        }

        moduleInfos.add(moduleInfo);
    }

    private Class<?> resolveExposedType(ConfigurableApplicationContext childCtx, String beanName, Object beanInstance, Class<?> userClass) {
        if (beanInstance instanceof Repository) {
            Class<?> repoType = childCtx.getType(beanName);
            if (repoType != null && repoType.isInterface()) {
                return repoType;
            }
            for (Class<?> iface : beanInstance.getClass().getInterfaces()) {
                if (Repository.class.isAssignableFrom(iface) && !iface.getName().startsWith("org.springframework.")) {
                    return iface;
                }
            }
        }
        return userClass;
    }

    private boolean isExposableBean(Object beanInstance, Class<?> userClass, Class<?> exposedType) {
        if (beanInstance instanceof Repository || beanInstance instanceof ModuleMapModifierProvider) {
            return true;
        }
        if (AnnotationUtils.findAnnotation(userClass, org.springframework.context.annotation.Configuration.class) != null
                || AnnotationUtils.findAnnotation(userClass, org.springframework.web.bind.annotation.ControllerAdvice.class) != null) {
            return false;
        }
        return AnnotationUtils.findAnnotation(userClass, RestController.class) != null
                || AnnotationUtils.findAnnotation(userClass, Controller.class) != null
                || AnnotationUtils.findAnnotation(userClass, Service.class) != null
                || AnnotationUtils.findAnnotation(userClass, Component.class) != null
                || AnnotationUtils.findAnnotation(userClass, Exposed.class) != null;
    }

    private DefaultListableBeanFactory getParentDefaultListableBeanFactory() {
        if (parentApplicationContext == null) {
            return null;
        }
        if (parentApplicationContext.getAutowireCapableBeanFactory() instanceof DefaultListableBeanFactory) {
            return (DefaultListableBeanFactory) parentApplicationContext.getAutowireCapableBeanFactory();
        }
        return null;
    }

    public void shutdown() {
        if (childApplicationContext != null) {
            try {
                childApplicationContext.close();
            } catch (Exception e) {
                LOG.warn("Error closing child context: {}", e.getMessage());
            }
        }
    }
}
