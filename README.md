# Apex Trust: Banking Transaction Management System

Apex Trust is a secure, full-stack Banking Transaction Management System. The application consists of a **Spring Boot REST API backend** secured with **JWT Stateless Authentication**, a **MySQL database** to maintain banking ledgers, and a modern **React + Vite frontend** showcasing a premium glassmorphic dark UI.

---

## Technical Architecture

### 1. Technology Stack
- **Backend**: Spring Boot (Spring Security, JPA, Validation)
- **Frontend**: React, Vite, Vanilla CSS, Axios, Lucide Icons, React Router
- **Database**: MySQL 8.0

### 2. Key Features
- **Stateless User Authentication**: Secure registration and login operations returning JWT authentication tokens.
- **Dynamic Account Management**: User dashboard listing multiple active bank accounts, support for creating **Savings** and **Checking** accounts with random 10-digit allocations.
- **Deposit / Withdrawal Mocking Modals**: Supports adding or deducting account balances with custom transaction description inputs.
- **Core Exception Protection**: Validations block overdrafts (insufficient funds) or invalid entries, returning detailed error structures via a Spring `@RestControllerAdvice`.
- **Comprehensive Ledger**: View detailed logs showing deposits, withdrawals, dates, and current values in real-time.

---

## Directory Structure

```
d:/JAVA_FSD
│   .gitignore           # Workspace build/system ignores
│   schema.sql           # Database schema parameters
│   test_apis.ps1        # PowerShell automated verification runner
│   README.md            # Installation & documentation manual
│
├───banking-backend      # Spring Boot Maven Project
│   └───src
│       └───main
│           ├───java/com/bank/app/
│           │   ├───controller/     # Rest Controllers (Auth/Accounts)
│           │   ├───dto/            # Request/Response Data Objects
│           │   ├───exception/      # Custom Exception Interceptors
│           │   ├───model/          # JPA Entities (User/Account/Transaction)
│           │   ├───repository/     # Repository Hooks
│           │   ├───security/       # JWT Filters & Configs
│           │   └───service/        # Business Services
│           └───resources/
│               └───application.properties # MySQL & JWT Parameters
│
└───banking-frontend     # React single-page client
    └───src
        ├───context/        # Auth user check states
        ├───pages/          # GUI views (Login/Register/Dashboard)
        ├───services/       # Axios wrappers and Interceptors
        ├───index.css       # Core Style Guide (Glassmorphic dark design)
        └───main.jsx        # App mounting configuration
```

---

## Running the Application

### 1. Database Setup
Ensure MySQL is running. Open a client or command line and run the schema setup:
```sql
CREATE DATABASE banking_db;
USE banking_db;
SOURCE d:/JAVA_FSD/schema.sql;
```

Update config parameters in `banking-backend/src/main/resources/application.properties` (username/password properties) if necessary.

### 2. Run API Backend (Port 8080)
Open a terminal in the backend workspace folder:
```bash
cd d:/JAVA_FSD/banking-backend
mvn spring-boot:run
```

### 3. Run React Frontend (Port 5173)
Open a terminal in the frontend workspace folder:
```bash
cd d:/JAVA_FSD/banking-frontend
npm install
npm run dev
```
Open `http://localhost:5173` to explore the bank portal dashboard.

---

## Testing / Verification Guide
A powershell script `test_apis.ps1` runs endpoint validations against the running Spring Boot service:
```powershell
powershell -ExecutionPolicy Bypass -File d:/JAVA_FSD/test_apis.ps1
```
The suite confirms:
- User registration and JWT credential fetching.
- Opening Savings bank account numbers.
- Adding $500.00 deposit payloads.
- Raising $600.00 withdrawal requests to assert custom Insufficient Funds check blocks (HTTP 400).
- Processing a successful $200.00 withdrawal and checking dynamic balances ($300.00).
- Inquiring transaction lists.
