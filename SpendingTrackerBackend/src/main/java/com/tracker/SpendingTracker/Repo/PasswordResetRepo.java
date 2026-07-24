package com.tracker.SpendingTracker.Repo;

import com.tracker.SpendingTracker.Models.PasswordReset;
import com.tracker.SpendingTracker.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRepo extends JpaRepository<PasswordReset, Long> {

  Optional<PasswordReset> findByUserAndCode(User user, String code);

  Optional<PasswordReset> findByUser(User user);

  void deleteByUser(User user);
}
