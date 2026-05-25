package org.lamisplus.modules.base.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.AccessDeniedException;
import org.lamisplus.modules.base.controller.vm.LoginVM;
import org.lamisplus.modules.base.security.JWTFilter;
import org.lamisplus.modules.base.security.TokenProvider;
import org.lamisplus.modules.base.service.BlacklistService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import static org.lamisplus.modules.base.util.Constants.ArtStatus.AUTHORIZATION_HEADER;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserJWTController {
    private final TokenProvider tokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final BlacklistService blacklistService;

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1";

//    public UserJWTController(TokenProvider tokenProvider, AuthenticationManagerBuilder authenticationManagerBuilder) {
//        this.tokenProvider = tokenProvider;
//        this.authenticationManagerBuilder = authenticationManagerBuilder;
//    }

    @PostMapping(BASE_URL_VERSION_ONE + "/authenticate")
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM) {
        String jwt = authorization(loginVM);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    @PostMapping(BASE_URL_VERSION_ONE + "/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {

        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            blacklistService.blacklistToken(bearerToken.substring(7));
            return ResponseEntity.ok("Token Blacklisted Successfully");
        } else{
            throw new AccessDeniedException(String.class, "Invalid token provided");
        }
    }

    public String authorization(LoginVM loginVM) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginVM.getUsername(),
                loginVM.getPassword()
        );

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        boolean rememberMe = (loginVM.isRememberMe() == null) ? false : loginVM.isRememberMe();
        return tokenProvider.createToken(authentication, rememberMe);
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    public static class JWTToken {
        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        public String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
