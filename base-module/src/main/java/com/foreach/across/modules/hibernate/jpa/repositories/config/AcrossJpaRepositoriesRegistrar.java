package com.foreach.across.modules.hibernate.jpa.repositories.config;

import org.springframework.data.jpa.repository.config.JpaRepositoryConfigExtension;
import org.springframework.data.repository.config.RepositoryBeanDefinitionRegistrarSupport;
import org.springframework.data.repository.config.RepositoryConfigurationExtension;

import java.lang.annotation.Annotation;

public class AcrossJpaRepositoriesRegistrar extends RepositoryBeanDefinitionRegistrarSupport {

    @Override
    protected Class<? extends Annotation> getAnnotation() {
        return EnableAcrossJpaRepositories.class;
    }

    @Override
    protected RepositoryConfigurationExtension getExtension() {
        return new JpaRepositoryConfigExtension();
    }
}
