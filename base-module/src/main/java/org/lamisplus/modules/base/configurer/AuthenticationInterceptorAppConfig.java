package org.lamisplus.modules.base.configurer;

import org.lamisplus.modules.base.interceptor.AuthenticationInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AuthenticationInterceptorAppConfig implements WebMvcConfigurer {

    final
    AuthenticationInterceptor authenticationInterceptor;

    public AuthenticationInterceptorAppConfig(AuthenticationInterceptor roleInterceptor) {
        this.authenticationInterceptor = roleInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authenticationInterceptor);
    }
}
