package com.bank.app.service;

import com.bank.app.dto.AccountCreateDto;
import com.bank.app.dto.AccountResponseDto;
import com.bank.app.dto.TransactionResponseDto;
import com.bank.app.exception.InsufficientFundsException;
import com.bank.app.exception.InvalidTransactionException;
import com.bank.app.exception.ResourceNotFoundException;
import com.bank.app.model.*;
import com.bank.app.repository.AccountRepository;
import com.bank.app.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;
    private final SecureRandom random = new SecureRandom();

    public AccountServiceImpl(AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            UserService userService) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.userService = userService;
    }

    @Override
    public AccountResponseDto createAccount(AccountCreateDto createDto) {
        User user = userService.getLoggedInUser();
        String accountNumber = generateUniqueAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .user(user)
                .balance(BigDecimal.ZERO)
                .accountType(createDto.getAccountType())
                .build();

        Account savedAccount = accountRepository.save(account);

        // Record a transaction for account creation
        Transaction transaction = Transaction.builder()
                .account(savedAccount)
                .transactionType(TransactionType.DEPOSIT)
                .amount(BigDecimal.ZERO)
                .description("Account created (" + createDto.getAccountType() + ")")
                .build();
        transactionRepository.save(transaction);

        return mapToAccountResponse(savedAccount);
    }

    @Override
    public List<AccountResponseDto> getMyAccounts() {
        User user = userService.getLoggedInUser();
        List<Account> accounts = accountRepository.findByUser(user);
        return accounts.stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BigDecimal getBalance(String accountNumber) {
        Account account = getValidatedAccount(accountNumber);
        return account.getBalance();
    }

    @Override
    public AccountResponseDto deposit(String accountNumber, BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Deposit amount must be greater than zero");
        }

        Account account = getValidatedAccount(accountNumber);
        account.setBalance(account.getBalance().add(amount));
        Account updatedAccount = accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .account(updatedAccount)
                .transactionType(TransactionType.DEPOSIT)
                .amount(amount)
                .description(description != null ? description : "Cash Deposit")
                .build();
        transactionRepository.save(transaction);

        return mapToAccountResponse(updatedAccount);
    }

    @Override
    public AccountResponseDto withdraw(String accountNumber, BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Withdrawal amount must be greater than zero");
        }

        Account account = getValidatedAccount(accountNumber);
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient funds. Available balance is " + account.getBalance());
        }

        account.setBalance(account.getBalance().subtract(amount));
        Account updatedAccount = accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .account(updatedAccount)
                .transactionType(TransactionType.WITHDRAWAL)
                .amount(amount)
                .description(description != null ? description : "Cash Withdrawal")
                .build();
        transactionRepository.save(transaction);

        return mapToAccountResponse(updatedAccount);
    }

    @Override
    public List<TransactionResponseDto> getTransactionHistory(String accountNumber) {
        Account account = getValidatedAccount(accountNumber);
        List<Transaction> transactions = transactionRepository.findByAccountOrderByTimestampDesc(account);
        return transactions.stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    private Account getValidatedAccount(String accountNumber) {
        User loggedInUser = userService.getLoggedInUser();
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account number " + accountNumber + " not found"));

        if (!account.getUser().getId().equals(loggedInUser.getId())) {
            throw new InvalidTransactionException("Unauthorized access to this bank account");
        }
        return account;
    }

    private String generateUniqueAccountNumber() {
        String num;
        do {
            long token = 1000000000L + random.nextLong(9000000000L);
            num = String.valueOf(token);
        } while (accountRepository.existsByAccountNumber(num));
        return num;
    }

    private AccountResponseDto mapToAccountResponse(Account account) {
        return AccountResponseDto.builder()
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .accountType(account.getAccountType())
                .createdAt(account.getCreatedAt())
                .build();
    }

    private TransactionResponseDto mapToTransactionResponse(Transaction transaction) {
        return TransactionResponseDto.builder()
                .id(transaction.getId())
                .accountNumber(transaction.getAccount().getAccountNumber())
                .transactionType(transaction.getTransactionType())
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .timestamp(transaction.getTimestamp())
                .build();
    }
}
