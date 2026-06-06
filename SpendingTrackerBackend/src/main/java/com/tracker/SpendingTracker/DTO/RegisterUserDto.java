package com.tracker.SpendingTracker.DTO;

import lombok.Data;

@Data
public class RegisterUserDto {

  private String Email;
  private String Password;
  private String UserName;
}
