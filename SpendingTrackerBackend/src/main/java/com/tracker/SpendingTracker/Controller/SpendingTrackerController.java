package com.tracker.SpendingTracker.Controller;

import com.tracker.SpendingTracker.DTO.SpendingTrackerDTO;
import com.tracker.SpendingTracker.Models.spendingTracker;
import com.tracker.SpendingTracker.Repo.SpendingTrackerRepo;
import com.tracker.SpendingTracker.Services.SpendingTrackerServices;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/spendingTracker")
@RequiredArgsConstructor
public class SpendingTrackerController {
    private final SpendingTrackerServices spendingTrackerServices;
    private final SpendingTrackerRepo spendingTrackerRepo;
    private static final Logger logger = LoggerFactory.getLogger(SpendingTrackerController.class);

    @PostMapping("/add")
    public ResponseEntity<String> addDailyTransaction(@RequestBody SpendingTrackerDTO spendingTrackerDTO) {
        if(duplicateDateEntries(spendingTrackerDTO.getDate())) {
            logger.error("Duplicate date entries not allowed!");
            return new ResponseEntity<>("Duplicate Date Entries Not Allowed!", HttpStatus.CONFLICT);
        };
        spendingTrackerServices.addDailyTransaction(spendingTrackerDTO);
        logger.info("Successfully called spendingTrackerServices Method");
        return new ResponseEntity<>("Successfully Added Transactions", HttpStatus.ACCEPTED);
    }

    @PatchMapping("/edit/{id}")
    public ResponseEntity<String> editTransaction(@PathVariable Long id, @RequestBody SpendingTrackerDTO spendingTrackerDTO) {
        spendingTrackerServices.editTransaction(id, spendingTrackerDTO);
        return new ResponseEntity<>("Successfully Updated Transaction", HttpStatus.OK);
    }

    @PatchMapping("/edit/date/{date}")
    public ResponseEntity<String> editTransaction(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, @RequestBody SpendingTrackerDTO spendingTrackerDTO) {
        spendingTrackerServices.editTransaction(date, spendingTrackerDTO);
        return new ResponseEntity<>("Successfully Updated Transaction", HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SpendingTrackerDTO>> getAllDailyTransactions() {
        List<SpendingTrackerDTO> dtoList = spendingTrackerServices.getDailyTransactions();
        return new ResponseEntity<>(dtoList, HttpStatus.OK);
    }

    @GetMapping("/all/{date}")
    public ResponseEntity<List<SpendingTrackerDTO>> getAllDailyTransactions(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<SpendingTrackerDTO> dtoList = spendingTrackerServices.getDailyTransactions(date);
        if (dtoList.isEmpty()) return new ResponseEntity<>(dtoList, HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(dtoList, HttpStatus.OK);
    }
    @DeleteMapping("/delete/{date}")
    public ResponseEntity<String> deleteTransaction(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date)
    {
        //If the transaction with the specified date cannot be found then let user know
        if(!(spendingTrackerRepo.findByDate(date).isPresent())) {
            logger.error("A transaction with the date: " + date + " doesn't exist!");
            return new ResponseEntity<>("Transaction not found for date: " + date, HttpStatus.OK);
        }
        spendingTrackerServices.deleteTransaction(date);
        return new ResponseEntity<>("Successfully deleted transaction with date: " + date, HttpStatus.OK);
    }

    /*----------- Private Helpers (Mostly for repeating logic) ---------------*/
    private boolean duplicateDateEntries(LocalDate date) {
        Optional<spendingTracker> duplicateDate = spendingTrackerRepo.findByDate(date);
        if(!duplicateDate.isEmpty()) return true;
        else return false;
    }
}
