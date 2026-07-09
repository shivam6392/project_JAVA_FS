package com.bank.app.dto;

import com.bank.app.model.AccountType;
import jakarta.validation.constraints.NotNull;

public class AccountCreateDto {
    @NotNull(message = "Account type is required (SAVINGS or CHECKING)")
    private AccountType accountType;

    public AccountCreateDto() {
    }

    public AccountCreateDto(AccountType accountType) {
        this.accountType = accountType;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
}
