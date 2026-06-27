package com.tracker.SpendingTracker.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;

@RestController
public class HealthController {
  private final DataSource dataSource;

  public HealthController(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  @GetMapping("/health")
  public String health() {
    try (Connection conn = dataSource.getConnection()) {
      return "OK - DB connected";
    } catch (Exception e) {
      return "OK - DB unreachable: " + e.getMessage();
    }
  }
}
