package com.foreach.across.core.context;

import com.foreach.across.core.AcrossContext;
import com.foreach.across.core.context.info.AcrossContextInfo;
import org.springframework.context.ApplicationContext;

public final class AcrossContextUtils {
    private AcrossContextUtils() {
    }

    public static AcrossContextInfo getContextInfo(AcrossContext context) {
        return context != null ? context.getContextInfo() : null;
    }

    public static ApplicationContext getApplicationContext(AcrossContext context) {
        return context != null ? context.getChildApplicationContext() : null;
    }
}
