package com.tracker.SpendingTracker.Repo;

import com.tracker.SpendingTracker.Models.spendingTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SpendingTrackerRepo extends JpaRepository<spendingTracker, Long> {
    Optional<spendingTracker> findTopByOrderByDateDesc();
    Optional<spendingTracker> findByDate(LocalDate date);
    List<spendingTracker> findAllByDate(LocalDate date);
    List<spendingTracker> findByDateAfter(LocalDate date);
    Optional<spendingTracker> findTopByDateBeforeOrderByDateDesc(LocalDate date);
    
}
