package com.tracker.SpendingTracker.Services;

import com.tracker.SpendingTracker.DTO.LoginUserDto;
import com.tracker.SpendingTracker.DTO.RegisterUserDto;
import com.tracker.SpendingTracker.Models.User;
import com.tracker.SpendingTracker.Repo.UserRepo;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

  private final UserRepo userRepo;

  private final PasswordEncoder passwordEncoder;

  private final AuthenticationManager authenticationManager;

  public AuthenticationService(
      UserRepo userRepo,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager) {
    this.userRepo = userRepo;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
  }

  public User signUp(RegisterUserDto input) {
    User user =
        new User(
            input.getUserName(), input.getEmail(), passwordEncoder.encode(input.getPassword()));
    return userRepo.save(user);
  }

  public User authenticate(LoginUserDto input) {
    User user =
        userRepo
            .findByEmail(input.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found!"));

    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(user.getUsername(), input.getPassword()));
    return user;
  }
}
