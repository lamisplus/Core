package com.foreach.across.modules.hibernate.jpa.repositories.config;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactoryBean;
import org.springframework.data.repository.config.BootstrapMode;
import org.springframework.data.repository.config.DefaultRepositoryBaseClass;
import org.springframework.data.repository.query.QueryLookupStrategy.Key;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import(AcrossJpaRepositoriesRegistrar.class)
public @interface EnableAcrossJpaRepositories {
    String[] value() default {};

    String[] basePackages() default {};

    Class<?>[] basePackageClasses() default {};

    Filter[] includeFilters() default {};

    Filter[] excludeFilters() default {};

    String repositoryImplementationPostfix() default "Impl";

    String namedQueriesLocation() default "";

    Key queryLookupStrategy() default Key.CREATE_IF_NOT_FOUND;

    Class<?> repositoryFactoryBeanClass() default JpaRepositoryFactoryBean.class;

    Class<?> repositoryBaseClass() default DefaultRepositoryBaseClass.class;

    String entityManagerFactoryRef() default "entityManagerFactory";

    String transactionManagerRef() default "transactionManager";

    boolean considerNestedRepositories() default false;

    boolean enableDefaultTransactions() default true;

    BootstrapMode bootstrapMode() default BootstrapMode.DEFAULT;

    char escapeCharacter() default '\\';
}
