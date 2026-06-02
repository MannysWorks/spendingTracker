package com.tracker.SpendingTracker.Filter;

import com.tracker.SpendingTracker.Services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter {
  private HandlerExceptionResolver handlerExceptionResolver;

  private final UserDetailsService userDetailsService;
  private final JwtService jwtService;
}
