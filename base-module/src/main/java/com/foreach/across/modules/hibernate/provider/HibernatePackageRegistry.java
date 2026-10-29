package com.foreach.across.modules.hibernate.provider;

public interface HibernatePackageRegistry {
    void addPackageToScan(Class<?>... packageClasses);

    default void addPackageToScan(String... packageNames) {
    }
}
