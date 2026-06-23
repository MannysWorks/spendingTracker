package com.tracker.SpendingTracker.Repo;

import com.tracker.SpendingTracker.Models.spendingTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SpendingTrackerRepo extends JpaRepository<spendingTracker, Long> {

  // Existing global queries
  Optional<spendingTracker> findTopByOrderByDateDesc();

  Optional<spendingTracker> findByDate(LocalDate date);

  List<spendingTracker> findAllByDate(LocalDate date);

  List<spendingTracker> findByDateAfter(LocalDate date);

  Optional<spendingTracker> findTopByDateBeforeOrderByDateDesc(LocalDate date);

  // ---- User-scoped queries (note the User_Id underscore for the relationship traversal) ----
  List<spendingTracker> findByUser_Id(Long userId);

  long countByUser_Id(Long userId);

  Optional<spendingTracker> findTopByUser_IdOrderByDateDesc(Long userId);

  Optional<spendingTracker> findByUser_IdAndDate(Long userId, LocalDate date);

  List<spendingTracker> findAllByUser_IdAndDate(Long userId, LocalDate date);

  List<spendingTracker> findByUser_IdAndDateAfter(Long userId, LocalDate date);

  Optional<spendingTracker> findTopByUser_IdAndDateBeforeOrderByDateDesc(
      Long userId, LocalDate date);

  void deleteByUser_IdAndDate(Long userId, LocalDate date);
}
