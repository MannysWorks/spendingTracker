package com.tracker.SpendingTracker.Models;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Table(name = "SpendingTracker")
@Entity
@Data
public class spendingTracker {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long ID;

  @ManyToOne
  @JoinColumn(name = "userId")
  private User user;

  @Column(name = "Date", nullable = false)
  private LocalDate date = LocalDate.now();

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal income;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal StartOfDayBalance;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal ColdCash;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal Grocery;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal FastFood;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal Bills;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal Subscriptions;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal Gas;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal Shopping;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal Miscellaneous;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal RobinHoodTransfer;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal EndOfDayBalance;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal RobinHood;

  @Column(columnDefinition = "NUMERIC(19,2) DEFAULT 0.00", precision = 19, scale = 2)
  private BigDecimal TotalAssets;

  @Column(columnDefinition = "NUMERIC(9,2) DEFAULT 0.00", precision = 9, scale = 2)
  private BigDecimal PercentChange;
}
