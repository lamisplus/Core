package org.lamisplus.modules.base.interceptor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.service.UserService;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuthenticationInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle (HttpServletRequest request, HttpServletResponse response, Object handler) {

        if (request.getRequestURI().contains("/api/")) {
            String details = request.getRemoteUser() + " | " +  request.getRemoteAddr() + " | " + request.getRequestURI();
            LOG.info("Request Username | IP | URL => {}", details);
            return true;
        }
        else{
            return true;
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion
            (HttpServletRequest request, HttpServletResponse response, Object
                    handler, Exception exception) throws Exception {
    }

    private boolean HandleEncounterController(@NotNull HttpServletRequest request) throws ResponseStatusException {
        Principal principal = request.getUserPrincipal();
        return true;
    }
}