package com.bank.app.service;

import com.bank.app.dto.AccountCreateDto;
import com.bank.app.dto.AccountResponseDto;
import com.bank.app.dto.TransactionResponseDto;
import java.math.BigDecimal;
import java.util.List;

public interface AccountService {
    AccountResponseDto createAccount(AccountCreateDto createDto);

    List<AccountResponseDto> getMyAccounts();

    BigDecimal getBalance(String accountNumber);

    AccountResponseDto deposit(String accountNumber, BigDecimal amount, String description);

    AccountResponseDto withdraw(String accountNumber, BigDecimal amount, String description);

    List<TransactionResponseDto> getTransactionHistory(String accountNumber);
}
