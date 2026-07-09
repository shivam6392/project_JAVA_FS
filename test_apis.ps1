# PowerShell API Verification Script for Banking Transaction Management System

$baseUrl = "http://localhost:8080/api"
$username = "shivatest_" + (Get-Date -Format "yyyyMMdd_HHmmss")
$password = "password123"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "STARTING API E2E VERIFICATION ON WINDOWS" -ForegroundColor Cyan
Write-Host "==========================================================`n" -ForegroundColor Cyan

# 1. Register User
Write-Host "[1/7] Registering New User..." -ForegroundColor Yellow
$regBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "SUCCESS: User registered successfully. ID: $($regResponse.id), Username: $($regResponse.username)" -ForegroundColor Green
} catch {
    Write-Error "FAILED: User registration failed. Error: $_"
    exit 1
}

# 2. Login User
Write-Host "`n[2/7] Logging In..." -ForegroundColor Yellow
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "SUCCESS: Logged in successfully. Token generated: $($token.Substring(0, 15))..." -ForegroundColor Green
} catch {
    Write-Error "FAILED: Login failed. Error: $_"
    exit 1
}

$headers = @{
    Authorization = "Bearer $token"
}

# 3. Create Account
Write-Host "`n[3/7] Creating Savings Bank Account..." -ForegroundColor Yellow
$accBody = @{
    accountType = "SAVINGS"
} | ConvertTo-Json

try {
    $accResponse = Invoke-RestMethod -Uri "$baseUrl/accounts" -Method Post -Body $accBody -Headers $headers -ContentType "application/json"
    $accountNumber = $accResponse.accountNumber
    Write-Host "SUCCESS: Account created. Number: $accountNumber, Balance: `$ $($accResponse.balance), Type: $($accResponse.accountType)" -ForegroundColor Green
} catch {
    Write-Error "FAILED: Account creation failed. Error: $_"
    exit 1
}

# 4. Deposit Money
Write-Host "`n[4/7] Depositing $500.00 to Account..." -ForegroundColor Yellow
$depBody = @{
    amount = 500.00
    description = "Salary Deposit"
} | ConvertTo-Json

try {
    $depResponse = Invoke-RestMethod -Uri "$baseUrl/accounts/$accountNumber/deposit" -Method Post -Body $depBody -Headers $headers -ContentType "application/json"
    Write-Host "SUCCESS: Money deposited. New Balance: `$ $($depResponse.balance)" -ForegroundColor Green
} catch {
    Write-Error "FAILED: Deposit failed. Error: $_"
    exit 1
}

# 5. Overdraft Attempt (Withdraw $600.00)
Write-Host "`n[5/7] Testing Invalid Withdrawal (Insufficient Funds: Withdraw $600.00 from $500.00)..." -ForegroundColor Yellow
$overdraftBody = @{
    amount = 600.00
    description = "Overdraft Attempt"
} | ConvertTo-Json

try {
    $overdraftResponse = Invoke-RestMethod -Uri "$baseUrl/accounts/$accountNumber/withdraw" -Method Post -Body $overdraftBody -Headers $headers -ContentType "application/json"
    Write-Host "FAILED: Overdraft withdrawal succeeded when it should have failed!" -ForegroundColor Red
    exit 1
} catch {
    $streamReader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $errJsonResponse = $streamReader.ReadToEnd() | ConvertFrom-Json
    Write-Host "SUCCESS: Custom exception handler caught exception as expected!" -ForegroundColor Green
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor DarkGreen
    Write-Host "Error Response Message: $($errJsonResponse.message)" -ForegroundColor DarkGreen
}

# 6. Valid Withdrawal (Withdraw $200.00)
Write-Host "`n[6/7] Testing Valid Withdrawal (Withdraw $200.00)..." -ForegroundColor Yellow
$withdrawBody = @{
    amount = 200.00
    description = "Groceries Expense"
} | ConvertTo-Json

try {
    $withdrawResponse = Invoke-RestMethod -Uri "$baseUrl/accounts/$accountNumber/withdraw" -Method Post -Body $withdrawBody -Headers $headers -ContentType "application/json"
    Write-Host "SUCCESS: Withdrawal processed. New Balance: `$ $($withdrawResponse.balance) (Expected: $300.00)" -ForegroundColor Green
} catch {
    Write-Error "FAILED: Valid withdrawal failed. Error: $_"
    exit 1
}

# 7. Check Transaction History
Write-Host "`n[7/7] Fetching Transaction History for Account $accountNumber..." -ForegroundColor Yellow
try {
    $history = Invoke-RestMethod -Uri "$baseUrl/accounts/$accountNumber/transactions" -Method Get -Headers $headers
    Write-Host "SUCCESS: Retrieved $($history.Count) transactions:" -ForegroundColor Green
    foreach ($tx in $history) {
        Write-Host " - ID: $($tx.id) | Type: $($tx.transactionType) | Amount: `$ $($tx.amount) | Note: $($tx.description) | Time: $($tx.timestamp)" -ForegroundColor DarkCyan
    }
} catch {
    Write-Error "FAILED: Fetching transactions failed. Error: $_"
    exit 1
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "ALL API VERIFICATION CHECKS COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
