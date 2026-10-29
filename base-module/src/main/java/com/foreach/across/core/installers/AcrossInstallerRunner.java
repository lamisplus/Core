package com.foreach.across.core.installers;

import com.foreach.across.core.annotations.Installer;
import liquibase.integration.spring.SpringLiquibase;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.annotation.AnnotationAwareOrderComparator;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.type.filter.AnnotationTypeFilter;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Slf4j
public class AcrossInstallerRunner {

    public static void runInstallers(String moduleName, String basePackage, DataSource dataSource, ClassLoader classLoader) {
        if (dataSource == null || StringUtils.isBlank(basePackage)) {
            return;
        }
        try {
            ensureInstallerTable(dataSource);

            ClassPathScanningCandidateComponentProvider scanner =
                    new ClassPathScanningCandidateComponentProvider(false);
            scanner.setResourceLoader(new DefaultResourceLoader(classLoader));
            scanner.addIncludeFilter(new AnnotationTypeFilter(Installer.class));

            Set<BeanDefinition> candidates = scanner.findCandidateComponents(basePackage + ".installers");
            if (candidates.isEmpty()) {
                candidates = scanner.findCandidateComponents(basePackage);
            }

            List<Object> installers = new ArrayList<>();
            for (BeanDefinition bd : candidates) {
                try {
                    Class<?> clazz = Class.forName(bd.getBeanClassName(), true, classLoader);
                    Object instance = clazz.getDeclaredConstructor().newInstance();
                    installers.add(instance);
                } catch (Exception e) {
                    LOG.error("Could not instantiate installer {}: {}", bd.getBeanClassName(), e.getMessage());
                }
            }

            installers.sort(AnnotationAwareOrderComparator.INSTANCE);

            for (Object installerObj : installers) {
                Installer installerMeta = AnnotationUtils.findAnnotation(installerObj.getClass(), Installer.class);
                if (installerMeta == null) {
                    continue;
                }
                String installerId = StringUtils.isNotBlank(installerMeta.name())
                        ? installerMeta.name()
                        : installerObj.getClass().getName();
                int targetVersion = installerMeta.version();
                InstallerRunCondition condition = installerMeta.runCondition();

                boolean shouldRun = false;
                if (condition == InstallerRunCondition.AlwaysRun) {
                    shouldRun = true;
                } else if (condition == InstallerRunCondition.VersionDifferent) {
                    Integer currentVersion = getInstalledVersion(dataSource, moduleName, installerId);
                    shouldRun = (currentVersion == null || currentVersion != targetVersion);
                }

                if (shouldRun && installerObj instanceof AcrossLiquibaseInstaller) {
                    AcrossLiquibaseInstaller liquibaseInstaller = (AcrossLiquibaseInstaller) installerObj;
                    String changeLog = liquibaseInstaller.getChangeLog();
                    if (StringUtils.isNotBlank(changeLog)) {
                        LOG.info("Running Liquibase installer [{}] ({}) for module {}", installerId, changeLog, moduleName);
                        SpringLiquibase liquibase = new SpringLiquibase();
                        liquibase.setDataSource(dataSource);
                        liquibase.setChangeLog(changeLog);
                        liquibase.setResourceLoader(new DefaultResourceLoader(classLoader));
                        liquibase.setShouldRun(true);
                        liquibase.afterPropertiesSet();
                        recordInstalledVersion(dataSource, moduleName, installerId, targetVersion, installerMeta.description());
                    }
                }
            }
        } catch (Exception e) {
            LOG.error("Error running installers for module {}: {}", moduleName, e.getMessage(), e);
            throw new RuntimeException("Failed to run installers for module " + moduleName, e);
        }
    }

    private static void ensureInstallerTable(DataSource dataSource) throws SQLException {
        String sql = "CREATE TABLE IF NOT EXISTS across_modules (" +
                "module_id VARCHAR(120) NOT NULL, " +
                "installer_id VARCHAR(120) NOT NULL, " +
                "version INT NOT NULL, " +
                "installed TIMESTAMP NOT NULL, " +
                "description VARCHAR(500), " +
                "PRIMARY KEY (module_id, installer_id))";
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
        } catch (SQLException e) {
            LOG.debug("across_modules table check note: {}", e.getMessage());
        }
    }

    private static Integer getInstalledVersion(DataSource dataSource, String moduleName, String installerId) {
        String sql = "SELECT version FROM across_modules WHERE module_id = ? AND installer_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, moduleName);
            ps.setString(2, installerId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            LOG.debug("Could not query across_modules for {}/{}: {}", moduleName, installerId, e.getMessage());
        }
        return null;
    }

    private static void recordInstalledVersion(DataSource dataSource, String moduleName, String installerId, int version, String description) {
        String updateSql = "UPDATE across_modules SET version = ?, installed = ?, description = ? WHERE module_id = ? AND installer_id = ?";
        String insertSql = "INSERT INTO across_modules (module_id, installer_id, version, installed, description) VALUES (?, ?, ?, ?, ?)";
        Timestamp now = new Timestamp(System.currentTimeMillis());
        String desc = StringUtils.left(description, 500);
        try (Connection conn = dataSource.getConnection()) {
            int updated;
            try (PreparedStatement ps = conn.prepareStatement(updateSql)) {
                ps.setInt(1, version);
                ps.setTimestamp(2, now);
                ps.setString(3, desc);
                ps.setString(4, moduleName);
                ps.setString(5, installerId);
                updated = ps.executeUpdate();
            }
            if (updated == 0) {
                try (PreparedStatement ps = conn.prepareStatement(insertSql)) {
                    ps.setString(1, moduleName);
                    ps.setString(2, installerId);
                    ps.setInt(3, version);
                    ps.setTimestamp(4, now);
                    ps.setString(5, desc);
                    ps.executeUpdate();
                }
            }
        } catch (SQLException e) {
            LOG.debug("Could not record installer version for {}/{}: {}", moduleName, installerId, e.getMessage());
        }
    }
}
