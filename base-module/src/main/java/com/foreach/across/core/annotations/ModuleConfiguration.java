package com.foreach.across.core.annotations;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ModuleConfiguration {
    String[] value() default {};
    String[] optional() default {};
}
