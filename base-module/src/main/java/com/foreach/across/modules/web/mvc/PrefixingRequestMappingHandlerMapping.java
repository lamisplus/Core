package com.foreach.across.modules.web.mvc;

import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.lang.reflect.Method;

public class PrefixingRequestMappingHandlerMapping extends RequestMappingHandlerMapping {

    @Override
    public RequestMappingInfo getMappingForMethod(Method method, Class<?> handlerType) {
        return super.getMappingForMethod(method, handlerType);
    }

    @Override
    public void registerMapping(RequestMappingInfo mapping, Object handler, Method method) {
        if (getHandlerMethods().containsKey(mapping)) {
            unregisterMapping(mapping);
        }
        super.registerMapping(mapping, handler, method);
    }
}
