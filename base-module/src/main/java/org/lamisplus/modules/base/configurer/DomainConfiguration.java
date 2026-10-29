package org.lamisplus.modules.base.configurer;


import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.BaseDomain;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(basePackageClasses = BaseDomain.class)
@EnableJpaRepositories(basePackageClasses = BaseDomain.class)
@Slf4j
public class DomainConfiguration {

}
