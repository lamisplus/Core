package org.lamisplus;

import com.foreach.across.config.AcrossApplication;
import com.foreach.across.modules.web.AcrossWebModule;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseModule;
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
import java.util.List;

@AcrossApplication(
        modules = {
                AcrossWebModule.NAME,
                BaseModule.NAME

        })
@Slf4j
@EnableSwagger2
@EnableAsync
@EnableScheduling
public class LamisPlusApplication  {


    private static ConfigurableApplicationContext context;

    public static String modulePath = System.getProperty ("user.dir");


    public static void main(String[] args) {

        context = SpringApplication.run (LamisPlusApplication.class, args);
    }

//    @Override
//    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
//        return application.sources (LamisPlusApplication.class);
//    }

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
        ApplicationArguments args = context.getBean (ApplicationArguments.class);
        Thread thread = new Thread (() -> {
            context.close ();
            SpringApplication springApplication = new SpringApplication (LamisPlusApplication.class);
            //springApplication.setDefaultProperties(Collections.singletonMap("spring.config.additional-location", modulePath + File.separator +"config.yml"));
            context = springApplication.run (args.getSourceArgs ());
        });
        thread.setDaemon (false);
        thread.start ();
    }

    /*@Bean
    public void loadJar(){
        URLClassLoader classLoader = (URLClassLoader) ClassLoader.getSystemClassLoader();
        Class clazz= URLClassLoader.class;

        // Use reflection
        Method method= null;
        try {
            method = clazz.getDeclaredMethod("addURL", URL.class);

        method.setAccessible(true);

        String jarPath = modulePath + File.separator;
        ArrayList<String> jarFileList = new ArrayList<String>();
        jarFileList.add(jarPath+"database-entities-1.0.0.jar");

        for(String jar : jarFileList){
            File f = new File(jar);
            if(f.exists() == false){
                throw new Exception("File [" + jar + "] doesn't exist!");
            }

            System.out.println("Adding jar [" + jar + "]");
            method.invoke(classLoader, f.toURL());
        }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }*/
}
