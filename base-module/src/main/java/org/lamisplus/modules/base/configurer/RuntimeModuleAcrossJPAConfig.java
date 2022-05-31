package org.lamisplus.modules.base.configurer;

import com.foreach.across.core.AcrossContext;
import com.foreach.across.modules.hibernate.jpa.AcrossHibernateJpaModule;
import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.sql.DataSource;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class RuntimeModuleAcrossJPAConfig {

    private final AcrossContext parent;

    @Bean
    @ConfigurationProperties("lamisplus.datasource.module")
    public DataSourceProperties moduleDataSourceProperties() {
        return new DataSourceProperties ();
    }

    @Bean
    @ConfigurationProperties("lamisplus.datasource.module")
    public DataSource moduleDataSource() {
        return moduleDataSourceProperties ()
                .initializeDataSourceBuilder ()
                .type (HikariDataSource.class)
                .build ();
    }


    @Bean
    public JdbcTemplate jdbcTemplate() {
        LOG.info ("data source from parent : {}", parent.getDataSource ());
        return new JdbcTemplate (parent.getDataSource ());
    }



}
