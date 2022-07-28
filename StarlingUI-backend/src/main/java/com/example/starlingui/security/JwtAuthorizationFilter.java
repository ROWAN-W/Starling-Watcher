package com.example.starlingui.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String authorizationHeader = request.getHeader(AUTHORIZATION);
            Authentication authentication = jwtTokenUtil.verifyAccessToken(authorizationHeader);
            //set authentication in the Security Context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.sendError(UNAUTHORIZED.value(), e.getMessage());
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        Set<String> skipUrls = new HashSet<>(Arrays.asList("/design/initialize",  "/login", "/tokens",
                "/refresh", "/monitor/*", "/design/database", "/register", "/design/images", "/blacklist"));
        AntPathMatcher pathMatcher = new AntPathMatcher();
        return skipUrls.stream().anyMatch(path -> pathMatcher.match(path, request.getServletPath()));
    }
}
