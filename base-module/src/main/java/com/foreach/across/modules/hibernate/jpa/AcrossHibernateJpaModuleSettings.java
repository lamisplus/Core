package com.foreach.across.modules.hibernate.jpa;

import org.springframework.orm.jpa.vendor.Database;

public class AcrossHibernateJpaModuleSettings {
    private String persistenceUnitName = "default";
    private Boolean primary = Boolean.TRUE;
    private Database database = Database.POSTGRESQL;

    public AcrossHibernateJpaModuleSettings() {
    }

    public String getPersistenceUnitName() {
        return persistenceUnitName;
    }

    public void setPersistenceUnitName(String persistenceUnitName) {
        this.persistenceUnitName = persistenceUnitName;
    }

    public Boolean getPrimary() {
        return primary;
    }

    public void setPrimary(Boolean primary) {
        this.primary = primary;
    }

    public Database getDatabase() {
        return database;
    }

    public void setDatabase(Database database) {
        this.database = database;
    }
}
