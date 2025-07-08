package com.twicenice.twicenice_backend.jwt;

import com.twicenice.twicenice_backend.service.CustomerDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomerDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws IOException, ServletException {
        System.out.println("=== NEW REQUEST ===");
        System.out.println("Request to: " + request.getRequestURI());
        System.out.println("Method: " + request.getMethod());

        final String authHeader = request.getHeader("Authorization");
        System.out.println("Auth header: " + (authHeader != null ? "present" : "missing"));
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No valid auth header, passing through");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            System.out.println("JWT token received");
            
            final String userEmail = jwtService.extractUsername(jwt);
            final String role = jwtService.extractRole(jwt);
            System.out.println("Extracted email: " + userEmail);
            System.out.println("Extracted role: " + role);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                System.out.println("Loading user details for: " + userEmail);
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                
                System.out.println("User authorities: " + userDetails.getAuthorities());
                
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    System.out.println("Token is valid, creating authentication");
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("Authentication set in security context");
                }
            }
        } catch (Exception e) {
            System.err.println("Authentication error: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Authentication failed: " + e.getMessage());
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}