package com.bank.app.dto;

import com.bank.app.model.AccountType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AccountResponseDto {
    private String accountNumber;
    private BigDecimal balance;
    private AccountType accountType;
    private LocalDateTime createdAt;

    public AccountResponseDto() {
    }

    public AccountResponseDto(String accountNumber, BigDecimal balance, AccountType accountType,
            LocalDateTime createdAt) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.accountType = accountType;
        this.createdAt = createdAt;
    }

    public static AccountResponseDtoBuilder builder() {
        return new AccountResponseDtoBuilder();
    }

    public static class AccountResponseDtoBuilder {
        private String accountNumber;
        private BigDecimal balance;
        private AccountType accountType;
        private LocalDateTime createdAt;

        public AccountResponseDtoBuilder accountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
            return this;
        }

        public AccountResponseDtoBuilder balance(BigDecimal balance) {
            this.balance = balance;
            return this;
        }

        public AccountResponseDtoBuilder accountType(AccountType accountType) {
            this.accountType = accountType;
            return this;
        }

        public AccountResponseDtoBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public AccountResponseDto build() {
            return new AccountResponseDto(accountNumber, balance, accountType, createdAt);
        }
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
