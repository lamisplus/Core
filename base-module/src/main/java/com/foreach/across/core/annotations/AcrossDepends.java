package com.foreach.across.core.annotations;

import java.lang.annotation.*;

@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AcrossDepends {
    String[] required() default {};
    String[] optional() default {};
}
