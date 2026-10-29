package com.foreach.across.core.installers;

public abstract class AcrossLiquibaseInstaller {
    private final String changeLog;

    public AcrossLiquibaseInstaller() {
        this.changeLog = null;
    }

    public AcrossLiquibaseInstaller(String changeLog) {
        this.changeLog = changeLog;
    }

    public String getChangeLog() {
        return changeLog;
    }
}
