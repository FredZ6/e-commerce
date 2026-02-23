package com.example.shop.filter;

import com.example.shop.service.UserService;
import com.example.shop.util.JwtTokenUtil;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final JwtTokenUtil jwtUtil;

    public JwtRequestFilter(UserService userService, JwtTokenUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                  @NonNull HttpServletResponse response, 
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        //  JWT Token 
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtUtil.getUsernameFromToken(jwtToken);
            } catch (ExpiredJwtException e) {
                log.error("JWT Token has expired");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token has expired");
                return;
            } catch (Exception e) {
                log.error("Unable to parse JWT Token", e);
            }
        } else {
            log.debug("JWT Token does not begin with Bearer String");
        }

        //  token
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userService.loadUserByUsername(username);
                
                log.debug("User authorities: {}", userDetails.getAuthorities());

                if (jwtUtil.validateToken(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    log.debug("Authenticated user: {} with authorities: {}", 
                             username, userDetails.getAuthorities());
                }
            } catch (UsernameNotFoundException e) {
                log.error("User not found: {}", username);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("User not found");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/auth/") || 
               path.startsWith("/api/public/") ||
               path.startsWith("/swagger-ui/") || 
               path.startsWith("/v3/api-docs/") ||
               path.equals("/api/users/register") ||
               path.equals("/api/users/login");
    }
}