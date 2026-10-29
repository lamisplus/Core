package com.foreach.across.core.annotations;

import com.foreach.across.core.installers.InstallerPhase;
import com.foreach.across.core.installers.InstallerRunCondition;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Installer {
    String name() default "";
    String description() default "";
    int version() default 1;
    InstallerRunCondition runCondition() default InstallerRunCondition.VersionDifferent;
    InstallerPhase phase() default InstallerPhase.BeforeContextBootstrap;
}
