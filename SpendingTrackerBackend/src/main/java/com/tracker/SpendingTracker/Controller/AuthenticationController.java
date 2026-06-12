package com.tracker.SpendingTracker.Controller;

import com.tracker.SpendingTracker.DTO.LoginUserDto;
import com.tracker.SpendingTracker.DTO.RegisterUserDto;
import com.tracker.SpendingTracker.Models.User;
import com.tracker.SpendingTracker.Responses.LoginResponse;
import com.tracker.SpendingTracker.Services.AuthenticationService;
import com.tracker.SpendingTracker.Services.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/spendingTracker/auth")
public class AuthenticationController {
  private final JwtService jwtService;

  private final AuthenticationService authenticationService;

  // Constructor
  public AuthenticationController(
      JwtService jwtService, AuthenticationService authenticationService) {
    this.authenticationService = authenticationService;
    this.jwtService = jwtService;
  }

  @PostMapping("/signup")
  public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
    User registeredUser = authenticationService.signUp(registerUserDto);
    return ResponseEntity.ok(registeredUser);
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@RequestBody LoginUserDto loginUserDto) {
    User loggedInUser = authenticationService.authenticate(loginUserDto);
    String jwt = jwtService.generateToken(loggedInUser);
    LoginResponse loginResponse = new LoginResponse(jwt, jwtService.getExpiration());
    return ResponseEntity.ok(loginResponse);
  }
}
