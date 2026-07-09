package com.bank.app.dto;

import com.bank.app.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponseDto {
    private Long id;
    private String accountNumber;
    private TransactionType transactionType;
    private BigDecimal amount;
    private String description;
    private LocalDateTime timestamp;

    public TransactionResponseDto() {
    }

    public TransactionResponseDto(Long id, String accountNumber, TransactionType transactionType, BigDecimal amount,
            String description, LocalDateTime timestamp) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.transactionType = transactionType;
        this.amount = amount;
        this.description = description;
        this.timestamp = timestamp;
    }

    public static TransactionResponseDtoBuilder builder() {
        return new TransactionResponseDtoBuilder();
    }

    public static class TransactionResponseDtoBuilder {
        private Long id;
        private String accountNumber;
        private TransactionType transactionType;
        private BigDecimal amount;
        private String description;
        private LocalDateTime timestamp;

        public TransactionResponseDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TransactionResponseDtoBuilder accountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
            return this;
        }

        public TransactionResponseDtoBuilder transactionType(TransactionType transactionType) {
            this.transactionType = transactionType;
            return this;
        }

        public TransactionResponseDtoBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public TransactionResponseDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TransactionResponseDtoBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public TransactionResponseDto build() {
            return new TransactionResponseDto(id, accountNumber, transactionType, amount, description, timestamp);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
