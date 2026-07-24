package com.tracker.SpendingTracker.Controller;

import com.tracker.SpendingTracker.Services.SpendingTrackerServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/v1/spendingTracker")
@RequiredArgsConstructor
public class ResetPasswordController {

  private final SpendingTrackerServices spendingTrackerServices;
  private static final Logger logger = LoggerFactory.getLogger(ResetPasswordController.class);

  /** Send password reset code to user's email */
  @PostMapping("/send-reset-code")
  public ResponseEntity<Map<String, String>> sendResetCode() {
    try {
      spendingTrackerServices.sendEmailToChangePassword();

      Map<String, String> response = new HashMap<>();
      response.put("message", "Reset code sent to your email");
      response.put("expiresIn", "15 minutes");

      logger.info("Password reset code sent successfully");
      return ResponseEntity.ok(response);

    } catch (Exception e) {
      logger.error("Error sending reset code: ", e);
      Map<String, String> error = new HashMap<>();
      error.put("error", "Failed to send reset code");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
  }

  // Reset password with code
  @PostMapping("/reset")
  public ResponseEntity<Map<String, String>> resetPassword(
      @RequestParam String resetCode, @RequestParam String newPassword) {

    try {
      String result = spendingTrackerServices.changePassword(resetCode, newPassword);

      Map<String, String> response = new HashMap<>();
      response.put("message", result);

      if (result.contains("successfully")) {
        logger.info("Password reset successful");
        return ResponseEntity.ok(response);
      } else {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
      }

    } catch (Exception e) {
      logger.error("Error resetting password: ", e);
      Map<String, String> error = new HashMap<>();
      error.put("error", "Failed to reset password");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
  }
}
