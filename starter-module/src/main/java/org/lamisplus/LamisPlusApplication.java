package org.lamisplus;

import com.foreach.across.config.AcrossApplication;
import com.foreach.across.modules.hibernate.jpa.AcrossHibernateJpaModule;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseModule;
import org.lamisplus.restart.RestartModule;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@AcrossApplication(
        modules = {
                BaseModule.NAME,
                AcrossHibernateJpaModule.NAME,
                RestartModule.NAME
        })
@Slf4j
@EnableSwagger2
@EnableAsync
@EnableScheduling
public class LamisPlusApplication  {
    private static ConfigurableApplicationContext context;
    public static String userDir = System.getProperty ("user.dir");

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(new Class[]{LamisPlusApplication.class});
        springApplication.setDefaultProperties(Collections.singletonMap("spring.config.additional-location", userDir + "/db-config.yml"));
        context = springApplication.run(args);
    }
    /*
     * Provides sensible defaults and convenience methods for configuration.
     * @return a Docket
     */
    @Bean
    public Docket api() {
        return new Docket (DocumentationType.SWAGGER_2)
                .apiInfo (apiInfo ())
                .securityContexts (Arrays.asList (securityContext ()))
                .securitySchemes (Arrays.asList (apiKey ()))
                .select ()
                .apis (RequestHandlerSelectors.any ())
                .paths (PathSelectors.any ())
                .build ();
    }
    /*
     *
     * @return ApiInfo for documentation
     */
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder ()
                .title ("Lamisplus")
                .description ("Lamisplus Application Api Documentation")
                .license ("Apache 2.0")
                .licenseUrl ("http://www.apache.org/licenses/LICENSE-2.0.html")
                .termsOfServiceUrl ("http://swagger.io/terms/")
                .version ("1.0.0").contact (new Contact ("Development Team", "http://lamisplus.org/base-module", "info@lamisplus.org"))
                .build ();
    }
    private SecurityContext securityContext() {
        return SecurityContext.builder ().securityReferences (defaultAuth ()).build ();
    }
    private List<SecurityReference> defaultAuth() {
        AuthorizationScope authorizationScope = new AuthorizationScope ("global", "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
        authorizationScopes[0] = authorizationScope;
        return Arrays.asList (new SecurityReference ("JWT", authorizationScopes));
    }
    /*
     * @Param name
     * @Param keyName
     * @Param passAs
     * @return ApiKey
     * Sending Authorization:
     */
    private ApiKey apiKey() {
        return new ApiKey ("JWT", "Authorization", "header");
    }
    public static void restart() {
        ApplicationArguments args = context.getBean(ApplicationArguments.class);
        Thread thread = new Thread(() -> {
            context.close();
            SpringApplication springApplication = new SpringApplication(new Class[]{LamisPlusApplication.class});
            springApplication.setDefaultProperties(Collections.singletonMap("spring.config.additional-location", "${user.home}/db-config.yml"));
            context = springApplication.run(args.getSourceArgs());
        });
        thread.setDaemon(false);
        thread.start();
    }
}
