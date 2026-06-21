package com.tracker.SpendingTracker.Filter;

import com.tracker.SpendingTracker.Services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final HandlerExceptionResolver handlerExceptionResolver;

  private final UserDetailsService userDetailsService;
  private final JwtService jwtService;

  // Runs once per request
  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {

    // Get the header from the request
    final String authHeader = request.getHeader("Authorization");

    System.out.println("=== JWT FILTER HIT ===");
    System.out.println("Path: " + request.getRequestURI());
    System.out.println("Auth header: " + authHeader);

    // If the JWT token stored in the host request is expired
    // TODO: clean this $#!% Up!
    // checks if the token is still valid
    /**
     * System.out.println( "Is JWT Expired: " + jwtService.isTokenValid( authHeader.substring(7),
     * userDetailsService.loadUserByUsername(
     * jwtService.extractUsername(authHeader.substring(7))))); *
     */

    // If this filter can not be applied to the request then
    // call the rest of the filter chain
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      // Extract the jwt token from the request header and the userEmail/name
      final String jwt = authHeader.substring(7);
      final String userEmail = jwtService.extractUsername(jwt);

      // Get the Authentication object
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

      // If there is no authentication object but there is a user,
      // get that user and verify the token sent with the request
      if (authentication == null && userEmail != null) {
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

        if (jwtService.isTokenValid(jwt, userDetails)) {
          UsernamePasswordAuthenticationToken authToken =
              new UsernamePasswordAuthenticationToken(
                  userDetails, null, userDetails.getAuthorities());
          // Details about the request
          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

          // After verifying the user add the authentication token to the security context holder
          SecurityContextHolder.getContext().setAuthentication(authToken);
        }
      }
      // Call the rest of the filter
      filterChain.doFilter(request, response);
    } catch (Exception e) {
      handlerExceptionResolver.resolveException(request, response, null, e);
    }
  }
}
