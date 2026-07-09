package com.bank.app.controller;

import com.bank.app.dto.*;
import com.bank.app.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<AccountResponseDto> createAccount(@Valid @RequestBody AccountCreateDto createDto) {
        AccountResponseDto response = accountService.createAccount(createDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AccountResponseDto>> getMyAccounts() {
        List<AccountResponseDto> response = accountService.getMyAccounts();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{accountNumber}/balance")
    public ResponseEntity<Map<String, Object>> getBalance(@PathVariable String accountNumber) {
        BigDecimal balance = accountService.getBalance(accountNumber);
        return ResponseEntity.ok(Map.of(
                "accountNumber", accountNumber,
                "balance", balance));
    }

    @PostMapping("/{accountNumber}/deposit")
    public ResponseEntity<AccountResponseDto> deposit(@PathVariable String accountNumber,
            @Valid @RequestBody TransactionRequestDto requestDto) {
        AccountResponseDto response = accountService.deposit(accountNumber, requestDto.getAmount(),
                requestDto.getDescription());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{accountNumber}/withdraw")
    public ResponseEntity<AccountResponseDto> withdraw(@PathVariable String accountNumber,
            @Valid @RequestBody TransactionRequestDto requestDto) {
        AccountResponseDto response = accountService.withdraw(accountNumber, requestDto.getAmount(),
                requestDto.getDescription());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<List<TransactionResponseDto>> getTransactionHistory(@PathVariable String accountNumber) {
        List<TransactionResponseDto> response = accountService.getTransactionHistory(accountNumber);
        return ResponseEntity.ok(response);
    }
}
