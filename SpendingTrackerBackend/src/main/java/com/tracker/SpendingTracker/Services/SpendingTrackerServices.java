package com.tracker.SpendingTracker.Services;

import com.tracker.SpendingTracker.DTO.SpendingTrackerDTO;
import com.tracker.SpendingTracker.DTOMapper.mapDTO;
import com.tracker.SpendingTracker.Models.spendingTracker;
import com.tracker.SpendingTracker.Repo.SpendingTrackerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor public class SpendingTrackerServices {
    private final SpendingTrackerRepo spendingTrackerRepo;
    private static final Logger logger = LoggerFactory.getLogger(SpendingTrackerServices.class);

    // ===================== PUBLIC METHODS =====================
    public List<SpendingTrackerDTO> getDailyTransactions() {
        List<spendingTracker> spendingTrackerList = spendingTrackerRepo.findAll();
        List<SpendingTrackerDTO> dtoList = new ArrayList<>();
        for (spendingTracker s : spendingTrackerList) {
            dtoList.add(mapDTO.mapSpendingTrackerDto(s));
        }
        return dtoList;
    }
    public List<SpendingTrackerDTO> getDailyTransactions(LocalDate date) {
        List<spendingTracker> spendingTrackerList = spendingTrackerRepo.findAllByDate(date);
        List<SpendingTrackerDTO> dtoList = new ArrayList<>();
        for (spendingTracker s : spendingTrackerList) {
            dtoList.add(mapDTO.mapSpendingTrackerDto(s));
        }
        return dtoList;
    }
    public void addDailyTransaction(SpendingTrackerDTO dto) {
        try {
            if(spendingTrackerRepo.count() == 0) {
                addFirstTransaction(dto);
                return;
            }
            Optional<spendingTracker> previousEntry = spendingTrackerRepo.findTopByOrderByDateDesc();

            BigDecimal previousTotalAssets = previousEntry
                    .map(spendingTracker::getTotalAssets)
                    .orElse(BigDecimal.ZERO);

            BigDecimal startOfDayBalance = previousEntry
                    .map(spendingTracker::getEndOfDayBalance)
                    .orElse(BigDecimal.ZERO);

            BigDecimal endOfDayBalance = calculateEndOfDayBalance(
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
                    nullSafe(dto.getRobinHoodTransfer())
            );

            BigDecimal totalAssets = calculateTotalAssets(endOfDayBalance, nullSafe(dto.getRobinHood()));
            BigDecimal percentChange = calculatePercentChange(totalAssets, previousTotalAssets);

            spendingTracker entity = new spendingTracker();
            /* If the date is not specified, it defaults to today */
            if(dto.getDate() != null ) {
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
        try {
            Optional<spendingTracker> previousEntry = spendingTrackerRepo.findTopByOrderByDateDesc();

            BigDecimal previousTotalAssets = previousEntry
                    .map(spendingTracker::getTotalAssets)
                    .orElse(BigDecimal.ZERO);

            spendingTracker existing = spendingTrackerRepo.findByDate(date)
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
            if (dto.getRobinHoodTransfer() != null) existing.setRobinHoodTransfer(dto.getRobinHoodTransfer());
            if (dto.getRobinHood() != null) existing.setRobinHood(dto.getRobinHood());

            // Recalculate derived fields using the updated entity values
            BigDecimal endOfDayBalance = calculateEndOfDayBalance(
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
                    nullSafe(existing.getRobinHoodTransfer())
            );

            BigDecimal totalAssets = calculateTotalAssets(endOfDayBalance, nullSafe(existing.getRobinHood()));
            BigDecimal percentChange = calculatePercentChange(totalAssets, previousTotalAssets);

            existing.setEndOfDayBalance(endOfDayBalance);
            existing.setTotalAssets(totalAssets);
            existing.setPercentChange(percentChange);

            spendingTrackerRepo.save(existing);

            calculateAllTransactionsAfterSpecificEntry(existing);

            logger.info("Successfully edited transaction with date: {}", date);

        } catch (Exception e) {
            logger.error("Error editing transaction: ", e);
        }
    }
    public void editTransaction(Long id, SpendingTrackerDTO dto) {
        try {
            spendingTracker existing = spendingTrackerRepo.findById(id)
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
            if (dto.getRobinHoodTransfer() != null) existing.setRobinHoodTransfer(dto.getRobinHoodTransfer());
            if (dto.getRobinHood() != null) existing.setRobinHood(dto.getRobinHood());

            // Recalculate derived fields using the updated entity values
            BigDecimal endOfDayBalance = calculateEndOfDayBalance(
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
                    nullSafe(existing.getRobinHoodTransfer())
            );

            BigDecimal totalAssets = calculateTotalAssets(endOfDayBalance, nullSafe(existing.getRobinHood()));

            existing.setEndOfDayBalance(endOfDayBalance);
            existing.setTotalAssets(totalAssets);

            spendingTrackerRepo.save(existing);
            calculateAllTransactionsAfterSpecificEntry(existing);
            logger.info("Successfully edited transaction with id: {}", id);

        } catch (Exception e) {
            logger.error("Error editing transaction: ", e);
        }
    }
    public void deleteTransaction(LocalDate date) {
        spendingTracker entity = spendingTrackerRepo.findByDate(date)
                .orElseThrow(() -> new RuntimeException("Transaction not found with date: " + date));
        spendingTrackerRepo.delete(entity);
        logger.info("Successfully deleted transaction with date: " + date);
    }
    // ===================== PRIVATE HELPERS =====================
    private void calculateAllTransactionsAfterSpecificEntry(spendingTracker spendingTracker) {
        List<spendingTracker> entryList = spendingTrackerRepo.findByDateAfter(spendingTracker.getDate());

        for(spendingTracker entry : entryList) {
            SpendingTrackerDTO dto = mapDTO.mapSpendingTrackerDto(entry);
            try {
            Optional<spendingTracker> previousEntry = spendingTrackerRepo.findTopByDateBeforeOrderByDateDesc(entry.getDate());

            BigDecimal previousTotalAssets = previousEntry
                    .map(s -> s.getTotalAssets())
                    .orElse(BigDecimal.ZERO);

            BigDecimal startOfDayBalance = previousEntry
                    .map(s -> s.getEndOfDayBalance())
                    .orElse(BigDecimal.ZERO);

            BigDecimal endOfDayBalance = calculateEndOfDayBalance(
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
                    nullSafe(dto.getRobinHoodTransfer())
            );

            BigDecimal totalAssets = calculateTotalAssets(endOfDayBalance, nullSafe(dto.getRobinHood()));
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
    private void addFirstTransaction(SpendingTrackerDTO dto) {
        try {
            spendingTracker entity = new spendingTracker();
            entity.setDate(dto.getDate());
            entity.setIncome(nullSafe(dto.getIncome()));
            entity.setStartOfDayBalance(dto.getStartOfDayBalance());
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
            entity.setEndOfDayBalance(dto.getEndOfDayBalance());
            entity.setTotalAssets(dto.getTotalAssets());
            entity.setPercentChange(dto.getPercentChange());

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
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}