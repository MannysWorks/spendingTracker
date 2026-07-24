package com.tracker.SpendingTracker.Services;

import com.tracker.SpendingTracker.DTO.SpendingTrackerDTO;
import com.tracker.SpendingTracker.DTOMapper.mapDTO;
import com.tracker.SpendingTracker.Models.PasswordReset;
import com.tracker.SpendingTracker.Models.User;
import com.tracker.SpendingTracker.Models.spendingTracker;
import com.tracker.SpendingTracker.Repo.PasswordResetRepo;
import com.tracker.SpendingTracker.Repo.SpendingTrackerRepo;
import com.tracker.SpendingTracker.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SpendingTrackerServices {
  private final SpendingTrackerRepo spendingTrackerRepo;
  private final UserRepo userRepo;
  private final EmailSenderService emailSenderService;
  private final PasswordResetRepo passwordResetRepo;
  private final PasswordEncoder passwordEncoder;

  private static final Logger logger = LoggerFactory.getLogger(SpendingTrackerServices.class);
  private static final SecureRandom random = new SecureRandom();

  // ===================== PUBLIC METHODS =====================

  public List<SpendingTrackerDTO> getDailyTransactions() {
    User user = getCurrentUser();
    List<spendingTracker> spendingTrackerList = spendingTrackerRepo.findByUser_Id(user.getId());

    List<SpendingTrackerDTO> dtoList = new ArrayList<>();
    for (spendingTracker s : spendingTrackerList) {
      dtoList.add(mapDTO.mapSpendingTrackerDto(s));
    }
    return dtoList;
  }

  public List<SpendingTrackerDTO> getDailyTransactions(LocalDate date) {
    User user = getCurrentUser();
    List<spendingTracker> spendingTrackerList =
        spendingTrackerRepo.findAllByUser_IdAndDate(user.getId(), date);

    List<SpendingTrackerDTO> dtoList = new ArrayList<>();
    for (spendingTracker s : spendingTrackerList) {
      dtoList.add(mapDTO.mapSpendingTrackerDto(s));
    }
    return dtoList;
  }

  public void sendEmailToChangePassword() {
    User user = getCurrentUser();
    String resetCode = generate6DigitCode();

    PasswordReset reset = new PasswordReset();
    reset.setUser(user);
    reset.setCode(resetCode);
    reset.setCreatedAt(LocalDateTime.now());
    passwordResetRepo.save(reset);

    String emailBody =
        "<p>Here is your password reset code:</p>"
            + "<h2>"
            + resetCode
            + "</h2>"
            + "<p>This code expires in 15 minutes.</p>"
            + "<p>If you didn't request this, ignore this email.</p>";

    emailSenderService.sendEmail(user.getEmail(), "Reset Password Code", emailBody);
  }

  public String changePassword(String resetCode, String newPassword) {
    User user = getCurrentUser();

    try {
      // Validate reset code exists and belongs to user
      Optional<PasswordReset> resetOptional = passwordResetRepo.findByUserAndCode(user, resetCode);

      if (resetOptional.isEmpty()) {
        return "Invalid reset code";
      }

      PasswordReset reset = resetOptional.get();

      // Check if code has expired (15 minutes)
      long minutesElapsed = Duration.between(reset.getCreatedAt(), LocalDateTime.now()).toMinutes();
      if (minutesElapsed >= 15) {
        passwordResetRepo.deleteByUser(user);
        return "Reset code has expired";
      }

      // Validate new password (basic check)
      if (newPassword == null || newPassword.length() < 8) {
        return "Password must be at least 8 characters";
      }

      // Update password
      user.setPassword(passwordEncoder.encode(newPassword));
      userRepo.save(user);

      // Clean up reset code
      passwordResetRepo.deleteByUser(user);

      logger.info("Password successfully changed for user: {}", user.getUsername());
      return "Password changed successfully";

    } catch (Exception e) {
      logger.error("Error changing password: ", e);
      return "An error occurred while changing password";
    }
  }

  public void addDailyTransaction(SpendingTrackerDTO dto) {
    User user = getCurrentUser();
    try {
      if (spendingTrackerRepo.countByUser_Id(user.getId()) == 0) {
        addFirstTransaction(dto, user);
        return;
      }
      Optional<spendingTracker> previousEntry =
          spendingTrackerRepo.findTopByUser_IdOrderByDateDesc(user.getId());

      BigDecimal previousTotalAssets =
          previousEntry.map(spendingTracker::getTotalAssets).orElse(BigDecimal.ZERO);

      BigDecimal startOfDayBalance =
          previousEntry.map(spendingTracker::getEndOfDayBalance).orElse(BigDecimal.ZERO);

      BigDecimal endOfDayBalance =
          calculateEndOfDayBalance(
              startOfDayBalance,
              nullSafe(dto.getIncome()),
              nullSafe(dto.getColdCash()),
              nullSafe(dto.getGrocery()),
              nullSafe(dto.getFastFood()),
              nullSafe(dto.getBills()),
              nullSafe(dto.getSubscriptions()),
              nullSafe(dto.getGas()),
              nullSafe(dto.getShopping()),
              nullSafe(dto.getMiscellaneous()),
              nullSafe(dto.getRobinHoodTransfer()));

      BigDecimal totalAssets = calculateTotalAssets(endOfDayBalance, nullSafe(dto.getRobinHood()));
      BigDecimal percentChange = calculatePercentChange(totalAssets, previousTotalAssets);

      spendingTracker entity = new spendingTracker();
      entity.setUser(user); // <-- scope the new row to the logged-in user
      if (dto.getDate() != null) {
        entity.setDate(dto.getDate());
      }
      entity.setIncome(nullSafe(dto.getIncome()));
      entity.setStartOfDayBalance(startOfDayBalance);
      entity.setColdCash(nullSafe(dto.getColdCash()));
      entity.setGrocery(nullSafe(dto.getGrocery()));
      entity.setFastFood(nullSafe(dto.getFastFood()));
      entity.setBills(nullSafe(dto.getBills()));
      entity.setSubscriptions(nullSafe(dto.getSubscriptions()));
      entity.setGas(nullSafe(dto.getGas()));
      entity.setShopping(nullSafe(dto.getShopping()));
      entity.setMiscellaneous(nullSafe(dto.getMiscellaneous()));
      entity.setRobinHoodTransfer(nullSafe(dto.getRobinHoodTransfer()));
      entity.setRobinHood(nullSafe(dto.getRobinHood()));
      entity.setEndOfDayBalance(endOfDayBalance);
      entity.setTotalAssets(totalAssets);
      entity.setPercentChange(percentChange);

      spendingTrackerRepo.save(entity);
      logger.info("Successfully saved transaction for date: {}", dto.getDate());

    } catch (Exception e) {
      logger.error("Error saving daily transaction: ", e);
    }
  }

  public void editTransaction(LocalDate date, SpendingTrackerDTO dto) {
    User user = getCurrentUser();
    try {
      Optional<spendingTracker> previousEntry =
          spendingTrackerRepo.findTopByUser_IdAndDateBeforeOrderByDateDesc(user.getId(), date);
      BigDecimal previousTotalAssets =
          previousEntry.map(spendingTracker::getTotalAssets).orElse(BigDecimal.ZERO);

      spendingTracker existing =
          spendingTrackerRepo
              .findByUser_IdAndDate(user.getId(), date)
              .orElseThrow(() -> new RuntimeException("Transaction not found with date: " + date));

      if (dto.getDate() != null) existing.setDate(dto.getDate());
      if (dto.getIncome() != null) existing.setIncome(dto.getIncome());
      if (dto.getColdCash() != null) existing.setColdCash(dto.getColdCash());
      if (dto.getGrocery() != null) existing.setGrocery(dto.getGrocery());
      if (dto.getFastFood() != null) existing.setFastFood(dto.getFastFood());
      if (dto.getBills() != null) existing.setBills(dto.getBills());
      if (dto.getSubscriptions() != null) existing.setSubscriptions(dto.getSubscriptions());
      if (dto.getGas() != null) existing.setGas(dto.getGas());
      if (dto.getShopping() != null) existing.setShopping(dto.getShopping());
      if (dto.getMiscellaneous() != null) existing.setMiscellaneous(dto.getMiscellaneous());
      if (dto.getRobinHoodTransfer() != null)
        existing.setRobinHoodTransfer(dto.getRobinHoodTransfer());
      if (dto.getRobinHood() != null) existing.setRobinHood(dto.getRobinHood());

      BigDecimal endOfDayBalance =
          calculateEndOfDayBalance(
              existing.getStartOfDayBalance(),
              nullSafe(existing.getIncome()),
              nullSafe(existing.getColdCash()),
              nullSafe(existing.getGrocery()),
              nullSafe(existing.getFastFood()),
              nullSafe(existing.getBills()),
              nullSafe(existing.getSubscriptions()),
              nullSafe(existing.getGas()),
              nullSafe(existing.getShopping()),
              nullSafe(existing.getMiscellaneous()),
              nullSafe(existing.getRobinHoodTransfer()));

      BigDecimal totalAssets =
          calculateTotalAssets(endOfDayBalance, nullSafe(existing.getRobinHood()));
      BigDecimal percentChange = calculatePercentChange(totalAssets, previousTotalAssets);
      logger.info("total assets {}", totalAssets);
      logger.info("prev Total assets {}", previousTotalAssets);

      existing.setEndOfDayBalance(endOfDayBalance);
      existing.setTotalAssets(totalAssets);
      existing.setPercentChange(percentChange);

      spendingTrackerRepo.save(existing);

      calculateAllTransactionsAfterSpecificEntry(existing, user);

      logger.info("Successfully edited transaction with date: {}", date);

    } catch (Exception e) {
      logger.error("Error editing transaction: ", e);
    }
  }

  public void editTransaction(Long id, SpendingTrackerDTO dto) {
    User user = getCurrentUser();
    try {
      spendingTracker existing =
          spendingTrackerRepo
              .findById(id)
              .filter(s -> s.getUser().getId().equals(user.getId())) // <-- ownership check
              .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

      if (dto.getDate() != null) existing.setDate(dto.getDate());
      if (dto.getIncome() != null) existing.setIncome(dto.getIncome());
      if (dto.getColdCash() != null) existing.setColdCash(dto.getColdCash());
      if (dto.getGrocery() != null) existing.setGrocery(dto.getGrocery());
      if (dto.getFastFood() != null) existing.setFastFood(dto.getFastFood());
      if (dto.getBills() != null) existing.setBills(dto.getBills());
      if (dto.getSubscriptions() != null) existing.setSubscriptions(dto.getSubscriptions());
      if (dto.getGas() != null) existing.setGas(dto.getGas());
      if (dto.getShopping() != null) existing.setShopping(dto.getShopping());
      if (dto.getMiscellaneous() != null) existing.setMiscellaneous(dto.getMiscellaneous());
      if (dto.getRobinHoodTransfer() != null)
        existing.setRobinHoodTransfer(dto.getRobinHoodTransfer());
      if (dto.getRobinHood() != null) existing.setRobinHood(dto.getRobinHood());

      BigDecimal endOfDayBalance =
          calculateEndOfDayBalance(
              existing.getStartOfDayBalance(),
              nullSafe(existing.getIncome()),
              nullSafe(existing.getColdCash()),
              nullSafe(existing.getGrocery()),
              nullSafe(existing.getFastFood()),
              nullSafe(existing.getBills()),
              nullSafe(existing.getSubscriptions()),
              nullSafe(existing.getGas()),
              nullSafe(existing.getShopping()),
              nullSafe(existing.getMiscellaneous()),
              nullSafe(existing.getRobinHoodTransfer()));

      BigDecimal totalAssets =
          calculateTotalAssets(endOfDayBalance, nullSafe(existing.getRobinHood()));

      existing.setEndOfDayBalance(endOfDayBalance);
      existing.setTotalAssets(totalAssets);

      spendingTrackerRepo.save(existing);
      calculateAllTransactionsAfterSpecificEntry(existing, user);
      logger.info("Successfully edited transaction with id: {}", id);

    } catch (Exception e) {
      logger.error("Error editing transaction: ", e);
    }
  }

  public void deleteTransaction(LocalDate date) {
    User user = getCurrentUser();
    spendingTracker entity =
        spendingTrackerRepo
            .findByUser_IdAndDate(user.getId(), date)
            .orElseThrow(() -> new RuntimeException("Transaction not found with date: " + date));
    spendingTrackerRepo.delete(entity);
    logger.info("Successfully deleted transaction with date: " + date);
  }

  // ===================== PRIVATE HELPERS =====================

  private User getCurrentUser() {
    String userName = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepo
        .findByUsername(userName)
        .orElseThrow(() -> new UsernameNotFoundException("This user doesn't seem to exist!"));
  }

  /** Generates a random 6-digit code (000000 - 999999) */
  public static String generate6DigitCode() {
    int code = random.nextInt(1000000);
    return String.format("%06d", code);
  }

  private void calculateAllTransactionsAfterSpecificEntry(
      spendingTracker spendingTracker, User user) {
    List<spendingTracker> entryList =
        spendingTrackerRepo.findByUser_IdAndDateAfter(user.getId(), spendingTracker.getDate());

    for (spendingTracker entry : entryList) {
      SpendingTrackerDTO dto = mapDTO.mapSpendingTrackerDto(entry);
      try {
        Optional<spendingTracker> previousEntry =
            spendingTrackerRepo.findTopByUser_IdAndDateBeforeOrderByDateDesc(
                user.getId(), entry.getDate());

        BigDecimal previousTotalAssets =
            previousEntry.map(s -> s.getTotalAssets()).orElse(BigDecimal.ZERO);

        BigDecimal startOfDayBalance =
            previousEntry.map(s -> s.getEndOfDayBalance()).orElse(BigDecimal.ZERO);

        BigDecimal endOfDayBalance =
            calculateEndOfDayBalance(
                startOfDayBalance,
                nullSafe(dto.getIncome()),
                nullSafe(dto.getColdCash()),
                nullSafe(dto.getGrocery()),
                nullSafe(dto.getFastFood()),
                nullSafe(dto.getBills()),
                nullSafe(dto.getSubscriptions()),
                nullSafe(dto.getGas()),
                nullSafe(dto.getShopping()),
                nullSafe(dto.getMiscellaneous()),
                nullSafe(dto.getRobinHoodTransfer()));

        BigDecimal totalAssets =
            calculateTotalAssets(endOfDayBalance, nullSafe(dto.getRobinHood()));
        BigDecimal percentChange = calculatePercentChange(totalAssets, previousTotalAssets);

        entry.setDate(dto.getDate());
        entry.setIncome(nullSafe(dto.getIncome()));
        entry.setStartOfDayBalance(startOfDayBalance);
        entry.setColdCash(nullSafe(dto.getColdCash()));
        entry.setGrocery(nullSafe(dto.getGrocery()));
        entry.setFastFood(nullSafe(dto.getFastFood()));
        entry.setBills(nullSafe(dto.getBills()));
        entry.setSubscriptions(nullSafe(dto.getSubscriptions()));
        entry.setGas(nullSafe(dto.getGas()));
        entry.setShopping(nullSafe(dto.getShopping()));
        entry.setMiscellaneous(nullSafe(dto.getMiscellaneous()));
        entry.setRobinHoodTransfer(nullSafe(dto.getRobinHoodTransfer()));
        entry.setRobinHood(nullSafe(dto.getRobinHood()));
        entry.setEndOfDayBalance(endOfDayBalance);
        entry.setTotalAssets(totalAssets);
        entry.setPercentChange(percentChange);

        spendingTrackerRepo.save(entry);
        logger.info("Successfully saved transaction for date: {}", dto.getDate());

      } catch (Exception e) {
        logger.error("Error saving daily transaction: ", e);
      }
    }
  }

  private void addFirstTransaction(SpendingTrackerDTO dto, User user) {
    BigDecimal endOfDayBalance =
        calculateEndOfDayBalance(
            nullSafe(dto.getStartOfDayBalance()),
            nullSafe(dto.getIncome()),
            nullSafe(dto.getColdCash()),
            nullSafe(dto.getGrocery()),
            nullSafe(dto.getFastFood()),
            nullSafe(dto.getBills()),
            nullSafe(dto.getSubscriptions()),
            nullSafe(dto.getGas()),
            nullSafe(dto.getShopping()),
            nullSafe(dto.getMiscellaneous()),
            nullSafe(dto.getRobinHoodTransfer()));
    try {
      spendingTracker entity = new spendingTracker();
      entity.setUser(user); // <-- scope the first row too
      entity.setDate(dto.getDate());
      entity.setIncome(nullSafe(dto.getIncome()));
      entity.setStartOfDayBalance(nullSafe(dto.getStartOfDayBalance()));
      entity.setColdCash(nullSafe(dto.getColdCash()));
      entity.setGrocery(nullSafe(dto.getGrocery()));
      entity.setFastFood(nullSafe(dto.getFastFood()));
      entity.setBills(nullSafe(dto.getBills()));
      entity.setSubscriptions(nullSafe(dto.getSubscriptions()));
      entity.setGas(nullSafe(dto.getGas()));
      entity.setShopping(nullSafe(dto.getShopping()));
      entity.setMiscellaneous(nullSafe(dto.getMiscellaneous()));
      entity.setRobinHoodTransfer(nullSafe(dto.getRobinHoodTransfer()));
      entity.setRobinHood(nullSafe(dto.getRobinHood()));
      entity.setEndOfDayBalance(endOfDayBalance);
      entity.setTotalAssets(
          calculateTotalAssets(entity.getEndOfDayBalance(), entity.getRobinHood()));
      entity.setPercentChange(nullSafe(dto.getPercentChange()));

      spendingTrackerRepo.save(entity);
    } catch (Exception e) {
      logger.error("Error saving daily transaction: ", e);
    }
  }

  private BigDecimal calculateEndOfDayBalance(
      BigDecimal startOfDayBalance,
      BigDecimal income,
      BigDecimal coldCash,
      BigDecimal grocery,
      BigDecimal fastFood,
      BigDecimal bills,
      BigDecimal subscriptions,
      BigDecimal gas,
      BigDecimal shopping,
      BigDecimal miscellaneous,
      BigDecimal robinHoodTransfer) {

    return startOfDayBalance
        .add(income)
        .add(coldCash)
        .subtract(grocery)
        .subtract(fastFood)
        .subtract(bills)
        .subtract(subscriptions)
        .subtract(gas)
        .subtract(shopping)
        .subtract(miscellaneous)
        .subtract(robinHoodTransfer);
  }

  private BigDecimal calculateTotalAssets(BigDecimal endOfDayBalance, BigDecimal robinHood) {
    return endOfDayBalance.add(robinHood);
  }

  private BigDecimal calculatePercentChange(BigDecimal current, BigDecimal previous) {
    if (previous.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
    return current
        .subtract(previous)
        .divide(previous, 4, RoundingMode.HALF_UP)
        .multiply(new BigDecimal("100"));
  }

  private BigDecimal nullSafe(BigDecimal value) {
    return value == null ? BigDecimal.ZERO : value;
  }
}
