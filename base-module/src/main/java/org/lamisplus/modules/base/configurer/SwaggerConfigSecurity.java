//package org.lamisplus.modules.base.configurer;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.annotation.Order;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//
//
//@EnableWebSecurity
//@RequiredArgsConstructor
//@Configuration
//@Order(2)
//public class SwaggerConfigSecurity extends WebSecurityConfigurerAdapter {
//
//    private static final String[] PERMIT_LIST = {"/v2/api-docs", "/configuration/ui", "/swagger-resources",
//            "/configuration/security", "/swagger-ui.html", "/webjars/**",
//            "/api/v1/authenticate", "/api/swagger-ui.html", "/api/application-codesets/codesetGroup", "/api/updates/server",
//            "/api/sync/**" //Permit temporarily for server
//    };
//
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//                .authorizeRequests()
//                .antMatchers(PERMIT_LIST)
//                .authenticated()
//                .and()
//                .httpBasic();
//
//    }
//
//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
//        auth
//                .inMemoryAuthentication()
//                .withUser("user").password("password").roles("USER");
//    }
//
//}
