# API Documentation - Modern Banking System

## Overview

This document provides comprehensive API documentation for the Modern Banking System backend. It defines all endpoints, data structures, authentication flows, and integration patterns required to support the frontend application.

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication & Security](#authentication--security)
3. [User Management](#user-management)
4. [KYC & Verification](#kyc--verification)
5. [Accounts & Balances](#accounts--balances)
6. [Transactions](#transactions)
7. [Transfers & Payments](#transfers--payments)
8. [Lending System](#lending-system)
9. [Markets & Trading](#markets--trading)
10. [Investment Management](#investment-management)
11. [Admin & Compliance](#admin--compliance)
12. [Notifications](#notifications)
13. [WebSocket Events](#websocket-events)
14. [Error Handling](#error-handling)
15. [Rate Limiting](#rate-limiting)

---

## Base Configuration

### Base URL
```
Production: https://api.banking.com
Staging: https://staging-api.banking.com
Development: http://localhost:5000
```

### API Version
```
Current Version: v1
Base Path: /api/v1
```

### Common Headers
```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
X-API-Version: v1
X-Request-ID: <uuid>
User-Agent: BankingApp/1.0
```

---

## Authentication & Security

### 1. User Registration

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123!",
  "accountType": "personal", // "personal" | "business"
  "dateOfBirth": "1990-01-01",
  "nationality": "US",
  "agreeToTerms": true,
  "agreeToMarketing": false,
  "referralCode": "REF123" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456789",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "accountType": "personal",
      "kycStatus": "pending",
      "emailVerified": false,
      "phoneVerified": false,
      "mfaEnabled": false,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "requiresEmailVerification": true,
    "verificationToken": "email_token_123"
  }
}
```

### 2. Email Verification

**Endpoint:** `POST /auth/verify-email`

**Request Body:**
```json
{
  "token": "email_token_123",
  "email": "john.doe@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### 3. User Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "rememberMe": true,
  "deviceInfo": {
    "deviceId": "device_123",
    "platform": "web",
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1"
  }
}
```

**Response (200) - No MFA:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456789",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "kycStatus": "verified",
      "mfaEnabled": true,
      "lastLoginAt": "2024-01-01T00:00:00Z",
      "roles": ["user"],
      "permissions": ["read:accounts", "write:transfers"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_123",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

**Response (200) - MFA Required:**
```json
{
  "success": true,
  "data": {
    "mfaRequired": true,
    "mfaToken": "mfa_temp_token_123",
    "availableMethods": ["totp", "sms"],
    "preferredMethod": "totp"
  }
}
```

### 4. MFA Verification

**Endpoint:** `POST /auth/verify-mfa`

**Request Body:**
```json
{
  "mfaToken": "mfa_temp_token_123",
  "code": "123456",
  "method": "totp" // "totp" | "sms"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456789",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "kycStatus": "verified",
      "mfaEnabled": true,
      "lastLoginAt": "2024-01-01T00:00:00Z",
      "roles": ["user"],
      "permissions": ["read:accounts", "write:transfers"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_123",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

### 5. Token Refresh

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh_token_123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "new_refresh_token_456",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

### 6. Logout

**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "allDevices": false // if true, logout from all devices
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 7. Password Reset Request

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset instructions sent to email",
  "resetTokenExpiry": "2024-01-01T01:00:00Z"
}
```

### 8. Password Reset Confirmation

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token_123",
  "newPassword": "NewSecurePassword456!",
  "confirmPassword": "NewSecurePassword456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## User Management

### 1. Get Current User

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456789",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "accountType": "personal",
      "kycStatus": "verified",
      "emailVerified": true,
      "phoneVerified": true,
      "mfaEnabled": true,
      "profilePicture": "https://cdn.banking.com/profiles/user_123456789.jpg",
      "preferences": {
        "currency": "USD",
        "timezone": "America/New_York",
        "language": "en",
        "notifications": {
          "email": true,
          "push": true,
          "sms": false
        }
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-01T12:00:00Z"
    }
  }
}
```

### 2. Update User Profile

**Endpoint:** `PUT /auth/me`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567891",
  "preferences": {
    "currency": "EUR",
    "timezone": "Europe/London",
    "language": "en",
    "notifications": {
      "email": true,
      "push": true,
      "sms": true
    }
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456789",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.doe@example.com",
      "phone": "+1234567891",
      "preferences": {
        "currency": "EUR",
        "timezone": "Europe/London",
        "language": "en",
        "notifications": {
          "email": true,
          "push": true,
          "sms": true
        }
      },
      "updatedAt": "2024-01-01T12:30:00Z"
    }
  }
}
```

### 3. Change Password

**Endpoint:** `PUT /auth/change-password`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "currentPassword": "SecurePassword123!",
  "newPassword": "NewSecurePassword456!",
  "confirmPassword": "NewSecurePassword456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 4. Setup MFA

**Endpoint:** `POST /auth/mfa/setup`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "method": "totp" // "totp" | "sms"
}
```

**Response (200) - TOTP:**
```json
{
  "success": true,
  "data": {
    "method": "totp",
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "backupCodes": [
      "12345678",
      "87654321",
      "11223344",
      "44332211",
      "55667788"
    ]
  }
}
```

### 5. Verify MFA Setup

**Endpoint:** `POST /auth/mfa/verify-setup`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "method": "totp",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "MFA enabled successfully",
  "data": {
    "backupCodes": [
      "12345678",
      "87654321",
      "11223344",
      "44332211",
      "55667788"
    ]
  }
}
```

### 6. Disable MFA

**Endpoint:** `DELETE /auth/mfa`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "password": "SecurePassword123!",
  "code": "123456" // Current MFA code
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "MFA disabled successfully"
}
```

---

## KYC & Verification

### 1. Get KYC Status

**Endpoint:** `GET /kyc/status`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "verified", // "pending" | "under_review" | "verified" | "rejected" | "expired"
    "level": "full", // "basic" | "intermediate" | "full"
    "submittedAt": "2024-01-01T00:00:00Z",
    "reviewedAt": "2024-01-02T00:00:00Z",
    "expiresAt": "2025-01-01T00:00:00Z",
    "documents": [
      {
        "type": "passport",
        "status": "verified",
        "submittedAt": "2024-01-01T00:00:00Z"
      },
      {
        "type": "address_proof",
        "status": "verified",
        "submittedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "rejectionReason": null,
    "nextSteps": []
  }
}
```

### 2. Submit KYC Documents

**Endpoint:** `POST /kyc/submit`

**Headers:** 
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
firstName: John
lastName: Doe
dateOfBirth: 1990-01-01
nationality: US
occupation: Software Engineer
sourceOfIncome: employment
addressLine1: 123 Main St
city: New York
state: NY
zipCode: 10001
country: US
idType: passport
idNumber: A12345678
idFile: [binary data]
selfieFile: [binary data]
addressProofFile: [binary data]
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "submissionId": "kyc_sub_123456789",
    "status": "under_review",
    "estimatedReviewTime": "1-2 business days",
    "submittedAt": "2024-01-01T00:00:00Z",
    "documents": [
      {
        "id": "doc_123",
        "type": "passport",
        "status": "uploaded",
        "fileName": "passport.jpg"
      },
      {
        "id": "doc_124",
        "type": "selfie",
        "status": "uploaded",
        "fileName": "selfie.jpg"
      },
      {
        "id": "doc_125",
        "type": "address_proof",
        "status": "uploaded",
        "fileName": "utility_bill.pdf"
      }
    ]
  }
}
```

### 3. Upload Additional Document

**Endpoint:** `POST /kyc/documents`

**Headers:** 
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
type: bank_statement
file: [binary data]
description: Bank statement for additional verification
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "documentId": "doc_126",
    "type": "bank_statement",
    "status": "uploaded",
    "fileName": "bank_statement.pdf",
    "uploadedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Accounts & Balances

### 1. Get All Balances

**Endpoint:** `GET /v1/accounts/balances`

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `includeHidden` (boolean, optional): Include hidden accounts
- `currency` (string, optional): Convert all balances to specific currency

**Response (200):**
```json
{
  "success": true,
  "data": {
    "balances": [
      {
        "accountId": "acc_usd_123",
        "currency": "USD",
        "available": 12500.75,
        "ledger": 12500.75,
        "pending": 0.00,
        "reserved": 0.00,
        "usdRate": 1.0,
        "lastUpdated": "2024-01-01T12:00:00Z"
      },
      {
        "accountId": "acc_btc_456",
        "currency": "BTC",
        "available": 0.25847392,
        "ledger": 0.25847392,
        "pending": 0.00,
        "reserved": 0.00,
        "usdRate": 45000.00,
        "usdValue": 11631.32,
        "lastUpdated": "2024-01-01T12:00:00Z"
      }
    ],
    "totalUsdValue": 24132.07,
    "lastUpdated": "2024-01-01T12:00:00Z"
  }
}
```

### 2. Get Specific Account Balance

**Endpoint:** `GET /v1/accounts/balances/{currency}`

**Headers:** `Authorization: Bearer <access_token>`

**Path Parameters:**
- `currency`: Currency code (e.g., USD, BTC, EUR)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accountId": "acc_usd_123",
    "currency": "USD",
    "available": 12500.75,
    "ledger": 12500.75,
    "pending": 0.00,
    "reserved": 0.00,
    "usdRate": 1.0,
    "lastUpdated": "2024-01-01T12:00:00Z",
    "history": [
      {
        "date": "2024-01-01",
        "balance": 12500.75
      },
      {
        "date": "2023-12-31",
        "balance": 12000.00
      }
    ]
  }
}
```

### 3. Get Account Details

**Endpoint:** `GET /v1/accounts/{accountId}`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "account": {
      "id": "acc_usd_123",
      "userId": "user_123456789",
      "currency": "USD",
      "type": "checking", // "checking" | "savings" | "crypto" | "investment"
      "name": "Primary Checking",
      "accountNumber": "****1234",
      "routingNumber": "021000021",
      "status": "active", // "active" | "frozen" | "closed"
      "balance": {
        "available": 12500.75,
        "ledger": 12500.75,
        "pending": 0.00,
        "reserved": 0.00
      },
      "limits": {
        "dailyWithdrawal": 10000.00,
        "monthlyTransfer": 50000.00,
        "remainingDaily": 10000.00,
        "remainingMonthly": 37499.25
      },
      "features": {
        "interestBearing": true,
        "interestRate": 0.05,
        "minimumBalance": 100.00,
        "overdraftProtection": true,
        "overdraftLimit": 1000.00
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "lastActivity": "2024-01-01T11:30:00Z"
    }
  }
}
```

### 4. Create New Account

**Endpoint:** `POST /v1/accounts`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "currency": "EUR",
  "type": "savings",
  "name": "Emergency Fund",
  "initialDeposit": 1000.00,
  "sourceAccountId": "acc_usd_123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "account": {
      "id": "acc_eur_789",
      "userId": "user_123456789",
      "currency": "EUR",
      "type": "savings",
      "name": "Emergency Fund",
      "accountNumber": "****5678",
      "status": "active",
      "balance": {
        "available": 1000.00,
        "ledger": 1000.00,
        "pending": 0.00,
        "reserved": 0.00
      },
      "createdAt": "2024-01-01T12:00:00Z"
    }
  }
}
```

---

## Transactions

### 1. Get Transaction History

**Endpoint:** `GET /v1/accounts/transactions`

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `accountId` (string, optional): Filter by specific account
- `currency` (string, optional): Filter by currency
- `type` (string, optional): Filter by transaction type
- `status` (string, optional): Filter by status
- `startDate` (string, optional): Start date (ISO 8601)
- `endDate` (string, optional): End date (ISO 8601)
- `limit` (number, optional, default: 50): Number of transactions
- `offset` (number, optional, default: 0): Pagination offset
- `sort` (string, optional, default: "desc"): Sort order

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_123456789",
        "accountId": "acc_usd_123",
        "type": "transfer_received", // "transfer_sent" | "transfer_received" | "payment" | "deposit" | "withdrawal" | "fee" | "interest"
        "status": "completed", // "pending" | "completed" | "failed" | "cancelled"
        "amount": 1250.00,
        "currency": "USD",
        "description": "Salary deposit",
        "reference": "SAL-2024-001",
        "category": "income",
        "counterparty": {
          "name": "Acme Corp",
          "accountNumber": "****9876",
          "type": "business"
        },
        "balanceAfter": 12500.75,
        "fees": {
          "amount": 0.00,
          "currency": "USD",
          "description": "No fee"
        },
        "metadata": {
          "payrollId": "PR-2024-001",
          "source": "ACH"
        },
        "createdAt": "2024-01-01T09:00:00Z",
        "completedAt": "2024-01-01T09:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 50,
      "offset": 0,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

### 2. Get Transaction Details

**Endpoint:** `GET /v1/transactions/{transactionId}`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "txn_123456789",
      "accountId": "acc_usd_123",
      "type": "transfer_received",
      "status": "completed",
      "amount": 1250.00,
      "currency": "USD",
      "description": "Salary deposit",
      "reference": "SAL-2024-001",
      "category": "income",
      "counterparty": {
        "name": "Acme Corp",
        "accountNumber": "****9876",
        "type": "business",
        "verified": true
      },
      "balanceAfter": 12500.75,
      "fees": {
        "amount": 0.00,
        "currency": "USD",
        "description": "No fee",
        "breakdown": []
      },
      "route": {
        "method": "ACH",
        "network": "Federal Reserve",
        "processingTime": "Same day"
      },
      "security": {
        "encrypted": true,
        "verified": true,
        "riskScore": "low"
      },
      "metadata": {
        "payrollId": "PR-2024-001",
        "source": "ACH",
        "ipAddress": "192.168.1.1",
        "userAgent": "BankingApp/1.0"
      },
      "timeline": [
        {
          "status": "initiated",
          "timestamp": "2024-01-01T08:59:00Z",
          "description": "Transaction initiated"
        },
        {
          "status": "processing",
          "timestamp": "2024-01-01T08:59:30Z",
          "description": "Processing payment"
        },
        {
          "status": "completed",
          "timestamp": "2024-01-01T09:00:00Z",
          "description": "Payment completed successfully"
        }
      ],
      "createdAt": "2024-01-01T08:59:00Z",
      "completedAt": "2024-01-01T09:00:00Z"
    }
  }
}
```

### 3. Export Transactions

**Endpoint:** `GET /v1/accounts/transactions/export`

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `format` (string, required): "csv" | "pdf" | "xlsx"
- `accountId` (string, optional): Filter by specific account
- `startDate` (string, required): Start date (ISO 8601)
- `endDate` (string, required): End date (ISO 8601)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://api.banking.com/downloads/transactions_2024_01.csv",
    "expiresAt": "2024-01-01T13:00:00Z",
    "fileSize": 2048576,
    "recordCount": 1250
  }
}
```

---

## Transfers & Payments

### 1. Estimate Transfer

**Endpoint:** `POST /v1/transfers/estimate`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "fromAccountId": "acc_usd_123",
  "toAccountId": "acc_eur_456", // or external account details
  "amount": 1000.00,
  "currency": "USD",
  "type": "internal", // "internal" | "external" | "international"
  "urgency": "standard" // "standard" | "express" | "instant"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "estimate": {
      "sourceAmount": 1000.00,
      "sourceCurrency": "USD",
      "targetAmount": 850.00,
      "targetCurrency": "EUR",
      "exchangeRate": 0.85,
      "fees": {
        "transferFee": 5.00,
        "exchangeFee": 10.00,
        "totalFees": 15.00,
        "currency": "USD"
      },
      "timeline": {
        "estimatedDelivery": "2024-01-01T15:00:00Z",
        "processingTime": "2-3 hours"
      },
      "limits": {
        "dailyRemaining": 9000.00,
        "monthlyRemaining": 45000.00
      }
    }
  }
}
```

### 2. Create Transfer

**Endpoint:** `POST /v1/transfers`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "fromAccountId": "acc_usd_123",
  "toAccountId": "acc_eur_456",
  "amount": 1000.00,
  "currency": "USD",
  "description": "Monthly savings transfer",
  "reference": "SAVE-2024-001",
  "urgency": "standard",
  "scheduledAt": null, // for immediate transfer
  "mfaCode": "123456" // required for large amounts
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "transfer": {
      "id": "transfer_123456789",
      "status": "processing",
      "fromAccountId": "acc_usd_123",
      "toAccountId": "acc_eur_456",
      "sourceAmount": 1000.00,
      "sourceCurrency": "USD",
      "targetAmount": 850.00,
      "targetCurrency": "EUR",
      "exchangeRate": 0.85,
      "fees": {
        "transferFee": 5.00,
        "exchangeFee": 10.00,
        "totalFees": 15.00,
        "currency": "USD"
      },
      "description": "Monthly savings transfer",
      "reference": "SAVE-2024-001",
      "estimatedCompletion": "2024-01-01T15:00:00Z",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  }
}
```

### 3. External Transfer (Bank to Bank)

**Endpoint:** `POST /v1/transfers/external`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "fromAccountId": "acc_usd_123",
  "toAccount": {
    "accountNumber": "1234567890",
    "routingNumber": "021000021",
    "accountType": "checking",
    "holderName": "Jane Smith",
    "bankName": "Chase Bank"
  },
  "amount": 500.00,
  "currency": "USD",
  "description": "Rent payment",
  "reference": "RENT-JAN-2024",
  "urgency": "standard",
  "mfaCode": "123456"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "transfer": {
      "id": "transfer_ext_123456789",
      "status": "pending_verification",
      "type": "external_ach",
      "fromAccountId": "acc_usd_123",
      "toAccount": {
        "accountNumber": "****7890",
        "routingNumber": "021000021",
        "holderName": "Jane Smith",
        "bankName": "Chase Bank"
      },
      "amount": 500.00,
      "currency": "USD",
      "fees": {
        "achFee": 3.00,
        "totalFees": 3.00,
        "currency": "USD"
      },
      "description": "Rent payment",
      "reference": "RENT-JAN-2024",
      "estimatedCompletion": "2024-01-03T09:00:00Z",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  }
}
```

### 4. International Wire Transfer

**Endpoint:** `POST /v1/transfers/international`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "fromAccountId": "acc_usd_123",
  "toAccount": {
    "iban": "GB29NWBK60161331926819",
    "swiftCode": "NWBKGB2L",
    "holderName": "John Smith",
    "holderAddress": "123 London St, London, UK",
    "bankName": "NatWest Bank",
    "bankAddress": "London, UK"
  },
  "amount": 2000.00,
  "currency": "USD",
  "purpose": "family_support", // regulatory requirement
  "description": "Monthly family support",
  "reference": "FAM-SUPPORT-JAN",
  "urgency": "standard",
  "mfaCode": "123456"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "transfer": {
      "id": "wire_intl_123456789",
      "status": "pending_compliance",
      "type": "international_wire",
      "fromAccountId": "acc_usd_123",
      "toAccount": {
        "iban": "GB29NWBK60161331926819",
        "swiftCode": "NWBKGB2L",
        "holderName": "John Smith",
        "bankName": "NatWest Bank"
      },
      "sourceAmount": 2000.00,
      "sourceCurrency": "USD",
      "targetAmount": 1600.00,
      "targetCurrency": "GBP",
      "exchangeRate": 0.80,
      "fees": {
        "wireFee": 25.00,
        "exchangeFee": 20.00,
        "intermediaryFee": 15.00,
        "totalFees": 60.00,
        "currency": "USD"
      },
      "purpose": "family_support",
      "description": "Monthly family support",
      "reference": "FAM-SUPPORT-JAN",
      "estimatedCompletion": "2024-01-03T17:00:00Z",
      "complianceRequired": true,
      "createdAt": "2024-01-01T12:00:00Z"
    }
  }
}
```

### 5. Get Transfer Status

**Endpoint:** `GET /v1/transfers/{transferId}`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transfer": {
      "id": "transfer_123456789",
      "status": "completed",
      "type": "internal",
      "fromAccountId": "acc_usd_123",
      "toAccountId": "acc_eur_456",
      "sourceAmount": 1000.00,
      "sourceCurrency": "USD",
      "targetAmount": 850.00,
      "targetCurrency": "EUR",
      "exchangeRate": 0.85,
      "actualExchangeRate": 0.8505,
      "fees": {
        "transferFee": 5.00,
        "exchangeFee": 10.00,
        "totalFees": 15.00,
        "currency": "USD"
      },
      "description": "Monthly savings transfer",
      "reference": "SAVE-2024-001",
      "timeline": [
        {
          "status": "initiated",
          "timestamp": "2024-01-01T12:00:00Z",
          "description": "Transfer initiated"
        },
        {
          "status": "processing",
          "timestamp": "2024-01-01T12:01:00Z",
          "description": "Processing transfer"
        },
        {
          "status": "completed",
          "timestamp": "2024-01-01T14:30:00Z",
          "description": "Transfer completed successfully"
        }
      ],
      "createdAt": "2024-01-01T12:00:00Z",
      "completedAt": "2024-01-01T14:30:00Z"
    }
  }
}
```

### 6. Cancel Transfer

**Endpoint:** `DELETE /v1/transfers/{transferId}`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "reason": "Changed my mind",
  "mfaCode": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transfer cancelled successfully",
  "data": {
    "refundAmount": 985.00,
    "refundCurrency": "USD",
    "refundAccountId": "acc_usd_123",
    "cancellationFee": 0.00,
    "estimatedRefundTime": "2024-01-01T16:00:00Z"
  }
}
```

---

## Lending System

### 1. Get Loan Products

**Endpoint:** `GET /v1/loans/products`

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `type` (string, optional): "personal" | "crypto_backed" | "business"
- `minAmount` (number, optional): Minimum loan amount
- `maxAmount` (number, optional): Maximum loan amount

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "loan_prod_personal_001",
        "name": "Personal Loan",
        "type": "personal",
        "description": "Unsecured personal loan for any purpose",
        "minAmount": 1000,
        "maxAmount": 50000,
        "currency": "USD",
        "terms": {
          "minTerm": 12,
          "maxTerm": 60,
          "termUnit": "months"
        },
        "interestRates": {
          "minApr": 5.99,
          "maxApr": 24.99,
          "type": "fixed"
        },
        "fees": {
          "originationFee": 1.5,
          "prepaymentPenalty": false,
          "lateFee": 25.00
        },
        "requirements": {
          "minCreditScore": 650,
          "minIncome": 30000,
          "kycRequired": true,
          "collateralRequired": false
        },
        "features": [
          "Fixed monthly payments",
          "No prepayment penalty",
          "Quick approval process"
        ]
      },
      {
        "id": "loan_prod_crypto_001",
        "name": "Crypto-Backed Loan",
        "type": "crypto_backed",
        "description": "Loan secured by cryptocurrency collateral",
        "minAmount": 500,
        "maxAmount": 1000000,
        "currency": "USD",
        "terms": {
          "minTerm": 1,
          "maxTerm": 36,
          "termUnit": "months"
        },
        "interestRates": {
          "minApr": 3.99,
          "maxApr": 12.99,
          "type": "variable"
        },
        "collateral": {
          "supportedAssets": ["BTC", "ETH", "USDC"],
          "minLtv": 0.25,
          "maxLtv": 0.70,
          "liquidationThreshold": 0.80,
          "marginCallThreshold": 0.75
        },
        "fees": {
          "originationFee": 0.5,
          "prepaymentPenalty": false,
          "liquidationFee": 2.0
        },
        "requirements": {
          "minCreditScore": null,
          "kycRequired": true,
          "collateralRequired": true
        }
      }
    ]
  }
}
```

### 2. Apply for Loan

**Endpoint:** `POST /v1/loans/applications`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "productId": "loan_prod_crypto_001",
  "requestedAmount": 10000,
  "currency": "USD",
  "term": 12,
  "purpose": "business_expansion",
  "collateral": [
    {
      "asset": "BTC",
      "amount": 0.5,
      "walletId": "wallet_btc_123"
    }
  ],
  "personalInfo": {
    "annualIncome": 75000,
    "employmentStatus": "employed",
    "employer": "Tech Corp Inc"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "application": {
      "id": "loan_app_123456789",
      "status": "pending_review", // "draft" | "pending_review" | "approved" | "rejected" | "requires_info"
      "productId": "loan_prod_crypto_001",
      "requestedAmount": 10000,
      "currency": "USD",
      "term": 12,
      "estimatedApr": 8.5,
      "collateral": [
        {
          "asset": "BTC",
          "amount": 0.5,
          "currentValue": 22500,
          "ltv": 0.44,
          "walletId": "wallet_btc_123"
        }
      ],
      "estimatedMonthlyPayment": 877.83,
      "totalInterest": 1533.96,
      "totalRepayment": 11533.96,
      "submittedAt": "2024-01-01T12:00:00Z",
      "estimatedDecision": "2024-01-02T12:00:00Z"
    }
  }
}
```

### 3. Get Loan Application Status

**Endpoint:** `GET /v1/loans/applications/{applicationId}`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "application": {
      "id": "loan_app_123456789",
      "status": "approved",
      "productId": "loan_prod_crypto_001",
      "requestedAmount": 10000,
      "approvedAmount": 10000,
      "currency": "USD",
      "term": 12,
      "apr": 8.25,
      "collateral": [
        {
          "asset": "BTC",
          "amount": 0.5,
          "lockedValue": 22500,
          "ltv": 0.44,
          "walletId": "wallet_btc_123"
        }
      ],
      "monthlyPayment": 875.50,
      "totalInterest": 1506.00,
      "totalRepayment": 11506.00,
      "fees": {
        "originationFee": 50.00,
        "totalFees": 50.00
      },
      "submittedAt": "2024-01-01T12:00:00Z",
      "approvedAt": "2024-01-02T10:30:00Z",
      "expiresAt": "2024-01-09T10:30:00Z",
      "nextSteps": [
        "Accept loan terms",
        "Sign loan agreement",
        "Collateral will be locked"
      ]
    }
  }
}
```

### 4. Accept Loan Terms

**Endpoint:** `POST /v1/loans/applications/{applicationId}/accept`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "acceptTerms": true,
  "digitalSignature": "John Doe - 2024-01-01T15:00:00Z",
  "disbursementAccountId": "acc_usd_123",
  "mfaCode": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "loan": {
      "id": "loan_123456789",
      "status": "active",
      "applicationId": "loan_app_123456789",
      "principal": 10000,
      "currency": "USD",
      "term": 12,
      "apr": 8.25,
      "monthlyPayment": 875.50,
      "remainingBalance": 10000,
      "nextPaymentDate": "2024-02-01T00:00:00Z",
      "nextPaymentAmount": 875.50,
      "collateral": [
        {
          "asset": "BTC",
          "amount": 0.5,
          "lockedValue": 22500,
          "currentValue": 22750,
          "ltv": 0.44,
          "liquidationThreshold": 0.80,
          "marginCallThreshold": 0.75,
          "status": "locked"
        }
      ],
      "disbursedAt": "2024-01-01T15:00:00Z",
      "maturityDate": "2025-01-01T00:00:00Z"
    }
  }
}
```

### 5. Get Active Loans

**Endpoint:** `GET /v1/loans`

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `status` (string, optional): Filter by loan status
- `type` (string, optional): Filter by loan type

**Response (200):**
```json
{
  "success": true,
  "data": {
    "loans": [
      {
        "id": "loan_123456789",
        "status": "active",
        "type": "crypto_backed",
        "principal": 10000,
        "currency": "USD",
        "remainingBalance": 8750.25,
        "nextPaymentDate": "2024-02-01T00:00:00Z",
        "nextPaymentAmount": 875.50,
        "apr": 8.25,
        "term": 12,
        "paymentsRemaining": 10,
        "collateral": [
          {
            "asset": "BTC",
            "amount": 0.5,
            "currentValue": 23000,
            "ltv": 0.38,
            "healthFactor": 2.63,
            "status": "healthy"
          }
        ],
        "riskLevel": "low",
        "createdAt": "2024-01-01T15:00:00Z"
      }
    ],
    "summary": {
      "totalLoans": 1,
      "totalOutstanding": 8750.25,
      "totalMonthlyPayments": 875.50,
      "averageApr": 8.25
    }
  }
}
```

### 6. Get Loan Details

**Endpoint:** `GET /v1/loans/{loanId}`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "loan": {
      "id": "loan_123456789",
      "status": "active",
      "type": "crypto_backed",
      "principal": 10000,
      "currency": "USD",
      "remainingBalance": 8750.25,
      "paidAmount": 1249.75,
      "apr": 8.25,
      "term": 12,
      "monthlyPayment": 875.50,
      "nextPaymentDate": "2024-02-01T00:00:00Z",
      "nextPaymentAmount": 875.50,
      "paymentsRemaining": 10,
      "maturityDate": "2025-01-01T00:00:00Z",
      "collateral": [
        {
          "asset": "BTC",
          "amount": 0.5,
          "lockedValue": 22500,
          "currentValue": 23000,
          "ltv": 0.38,
          "liquidationThreshold": 0.80,
          "marginCallThreshold": 0.75,
          "healthFactor": 2.63,
          "status": "healthy",
          "walletId": "wallet_btc_123"
        }
      ],
      "paymentSchedule": [
        {
          "paymentNumber": 1,
          "dueDate": "2024-02-01T00:00:00Z",
          "amount": 875.50,
          "principal": 806.17,
          "interest": 69.33,
          "status": "upcoming"
        }
      ],
      "paymentHistory": [
        {
          "paymentNumber": 0,
          "paidDate": "2024-01-15T10:00:00Z",
          "amount": 875.50,
          "principal": 806.42,
          "interest": 69.08,
          "status": "paid",
          "transactionId": "txn_payment_123"
        }
      ],
      "riskMetrics": {
        "riskLevel": "low",
        "healthFactor": 2.63,
        "daysToLiquidation": null,
        "marginCallPrice": 18000,
        "liquidationPrice": 14400
      },
      "createdAt": "2024-01-01T15:00:00Z",
      "lastUpdated": "2024-01-15T10:00:00Z"
    }
  }
}
```

### 7. Make Loan Payment

**Endpoint:** `POST /v1/loans/{loanId}/payments`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "amount": 875.50,
  "paymentType": "scheduled", // "scheduled" | "extra" | "full_payoff"
  "sourceAccountId": "acc_usd_123",
  "mfaCode": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "loan_payment_123456789",
      "loanId": "loan_123456789",
      "amount": 875.50,
      "principal": 806.17,
      "interest": 69.33,
      "paymentType": "scheduled",
      "status": "completed",
      "sourceAccountId": "acc_usd_123",
      "newBalance": 7944.08,
      "transactionId": "txn_payment_124",
      "processedAt": "2024-02-01T10:00:00Z"
    }
  }
}
```

### 8. Add Collateral

**Endpoint:** `POST /v1/loans/{loanId}/collateral`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "asset": "BTC",
  "amount": 0.1,
  "walletId": "wallet_btc_123",
  "mfaCode": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "collateral": {
      "asset": "BTC",
      "amount": 0.6,
      "addedAmount": 0.1,
      "currentValue": 27600,
      "newLtv": 0.32,
      "newHealthFactor": 3.15,
      "status": "healthy",
      "addedAt": "2024-01-15T12:00:00Z"
    }
  }
}
```

---

## Markets & Trading

### 1. Get Market Overview

**Endpoint:** `GET /v1/markets/overview`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "marketStats": {
      "totalMarketCap": 2450000000000,
      "totalVolume24h": 89500000000,
      "btcDominance": 42.5,
      "activeAssets": 15420,
      "lastUpdated": "2024-01-01T12:00:00Z"
    },
    "topGainers": [
      {
        "symbol": "ETH-USD",
        "price": 2850.75,
        "change24h": 8.5,
        "volume24h": 15600000000
      }
    ],
    "topLosers": [
      {
        "symbol": "ADA-USD",
        "price": 0.485,
        "change24h": -5.2,
        "volume24h": 890000000
      }
    ],
    "trending": [
      {
        "symbol": "BTC-USD",
        "price": 45250.00,
        "change24h": 2.1,
        "volume24h": 28900000000,
        "marketCap": 887000000000
      }
    ]
  }
}
```

### 2. Get Asset Prices

**Endpoint:** `GET /v1/markets/prices`

**Query Parameters:**
- `symbols` (string, optional): Comma-separated list of symbols
- `convert` (string, optional): Convert prices to specific currency

**Response (200):**
```json
{
  "success": true,
  "data": {
    "prices": {
      "BTC-USD": {
        "symbol": "BTC-USD",
        "price": 45250.00,
        "change24h": 2.1,
        "changePercent24h": 0.0464,
        "volume24h": 28900000000,
        "marketCap": 887000000000,
        "high24h": 45800.00,
        "low24h": 44100.00,
        "lastUpdated": "2024-01-01T12:00:00Z"
      },
      "ETH-USD": {
        "symbol": "ETH-USD",
        "price": 2850.75,
        "change24h": 8.5,
        "changePercent24h": 0.0299,
        "volume24h": 15600000000,
        "marketCap": 342000000000,
        "high24h": 2890.00,
        "low24h": 2780.00,
        "lastUpdated": "2024-01-01T12:00:00Z"
      }
    }
  }
}
```

### 3. Get Historical Data (Candles)

**Endpoint:** `GET /v1/markets/{symbol}/candles`

**Path Parameters:**
- `symbol`: Trading pair symbol (e.g., BTC-USD)

**Query Parameters:**
- `resolution` (string, required): "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w"
- `from` (number, optional): Start timestamp
- `to` (number, optional): End timestamp
- `limit` (number, optional, default: 100): Number of candles

**Response (200):**
```json
{
  "success": true,
  "data": {
    "symbol": "BTC-USD",
    "resolution": "1h",
    "candles": [
      {
        "timestamp": 1704110400,
        "open": 44800.00,
        "high": 45200.00,
        "low": 44650.00,
        "close": 45100.00,
        "volume": 1250000000
      },
      {
        "timestamp": 1704114000,
        "open": 45100.00,
        "high": 45350.00,
        "low": 44950.00,
        "close": 45250.00,
        "volume": 980000000
      }
    ]
  }
}
```

### 4. Get Order Book

**Endpoint:** `GET /v1/markets/{symbol}/orderbook`

**Path Parameters:**
- `symbol`: Trading pair symbol

**Query Parameters:**
- `depth` (number, optional, default: 20): Number of orders per side

**Response (200):**
```json
{
  "success": true,
  "data": {
    "symbol": "BTC-USD",
    "timestamp": "2024-01-01T12:00:00Z",
    "bids": [
      {
        "price": 45240.00,
        "size": 0.5,
        "total": 0.5
      },
      {
        "price": 45235.00,
        "size": 1.2,
        "total": 1.7
      }
    ],
    "asks": [
      {
        "price": 45250.00,
        "size": 0.8,
        "total": 0.8
      },
      {
        "price": 45255.00,
        "size": 0.3,
        "total": 1.1
      }
    ],
    "spread": 10.00,
    "spreadPercent": 0.0221
  }
}
```

### 5. Get Recent Trades

**Endpoint:** `GET /v1/markets/{symbol}/trades`

**Path Parameters:**
- `symbol`: Trading pair symbol

**Query Parameters:**
- `limit` (number, optional, default: 50): Number of trades

**Response (200):**
```json
{
  "success": true,
  "data": {
    "symbol": "BTC-USD",
    "trades": [
      {
        "id": "trade_123456789",
        "timestamp": "2024-01-01T12:00:00Z",
        "price": 45250.00,
        "size": 0.125,
        "side": "buy", // "buy" | "sell"
        "value": 5656.25
      },
      {
        "id": "trade_123456790",
        "timestamp": "2024-01-01T11:59:58Z",
        "price": 45245.00,
        "size": 0.05,
        "side": "sell",
        "value": 2262.25
      }
    ]
  }
}
```

---

## Investment Management

### 1. Get Investment Products

**Endpoint:** `GET /v1/investments/products`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "inv_prod_sp500",
        "name": "S&P 500 Index Fund",
        "type": "index_fund",
        "category": "equity",
        "riskLevel": "medium",
        "minInvestment": 100,
        "currency": "USD",
        "fees": {
          "managementFee": 0.03,
          "performanceFee": 0.0,
          "entryFee": 0.0,
          "exitFee": 0.0
        },
        "performance": {
          "ytd": 12.5,
          "oneYear": 18.2,
          "threeYear": 9.8,
          "fiveYear": 11.2
        },
        "description": "Tracks the S&P 500 index with low fees",
        "factSheet": "https://api.banking.com/documents/sp500_factsheet.pdf"
      }
    ]
  }
}
```

### 2. Get Portfolio Overview

**Endpoint:** `GET /v1/investments/portfolio`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolio": {
      "totalValue": 85000.00,
      "totalInvested": 75000.00,
      "totalGainLoss": 10000.00,
      "totalGainLossPercent": 13.33,
      "cash": 2500.00,
      "currency": "USD",
      "performance": {
        "today": 1.2,
        "ytd": 15.8,
        "oneYear": 22.4
      },
      "assetAllocation": [
        {
          "category": "equity",
          "value": 65000.00,
          "percentage": 76.47,
          "target": 70.0
        },
        {
          "category": "bonds",
          "value": 15000.00,
          "percentage": 17.65,
          "target": 20.0
        },
        {
          "category": "cash",
          "value": 5000.00,
          "percentage": 5.88,
          "target": 10.0
        }
      ],
      "holdings": [
        {
          "productId": "inv_prod_sp500",
          "name": "S&P 500 Index Fund",
          "shares": 250.5,
          "currentPrice": 180.50,
          "marketValue": 45215.25,
          "costBasis": 40000.00,
          "gainLoss": 5215.25,
          "gainLossPercent": 13.04,
          "percentage": 53.19
        }
      ],
      "lastUpdated": "2024-01-01T12:00:00Z"
    }
  }
}
```

### 3. Create Investment Order

**Endpoint:** `POST /v1/investments/orders`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "productId": "inv_prod_sp500",
  "orderType": "buy", // "buy" | "sell"
  "amountType": "value", // "value" | "shares"
  "amount": 1000.00,
  "sourceAccountId": "acc_usd_123",
  "executionType": "market", // "market" | "limit"
  "limitPrice": null,
  "validUntil": null,
  "mfaCode": "123456"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "inv_order_123456789",
      "status": "pending", // "pending" | "executed" | "cancelled" | "failed"
      "productId": "inv_prod_sp500",
      "orderType": "buy",
      "amountType": "value",
      "requestedAmount": 1000.00,
      "estimatedShares": 5.54,
      "estimatedPrice": 180.50,
      "executionType": "market",
      "sourceAccountId": "acc_usd_123",
      "fees": {
        "tradingFee": 0.00,
        "managementFee": 0.30,
        "totalFees": 0.30
      },
      "estimatedSettlement": "2024-01-03T16:00:00Z",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  }
}
```

---

## Admin & Compliance

### 1. Get KYC Queue

**Endpoint:** `GET /admin/kyc/queue`

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `status` (string, optional): Filter by KYC status
- `priority` (string, optional): Filter by priority
- `limit` (number, optional): Number of records
- `offset` (number, optional): Pagination offset

**Response (200):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "kyc_sub_123456789",
        "userId": "user_123456789",
        "userInfo": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com"
        },
        "status": "under_review",
        "priority": "high",
        "submittedAt": "2024-01-01T00:00:00Z",
        "assignedTo": "reviewer_001",
        "documents": [
          {
            "type": "passport",
            "status": "uploaded",
            "url": "/admin/documents/doc_123"
          }
        ],
        "riskScore": 25,
        "flags": []
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "offset": 0,
      "hasNext": true
    }
  }
}
```

### 2. Review KYC Application

**Endpoint:** `POST /admin/kyc/{submissionId}/review`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "decision": "approved", // "approved" | "rejected" | "requires_info"
  "comments": "All documents verified successfully",
  "level": "full", // "basic" | "intermediate" | "full"
  "rejectionReason": null,
  "requiredInfo": null
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "review": {
      "submissionId": "kyc_sub_123456789",
      "decision": "approved",
      "level": "full",
      "reviewedBy": "admin_user_001",
      "reviewedAt": "2024-01-02T10:00:00Z",
      "comments": "All documents verified successfully"
    }
  }
}
```

### 3. Get Audit Log

**Endpoint:** `GET /admin/audit`

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `userId` (string, optional): Filter by user ID
- `action` (string, optional): Filter by action type
- `startDate` (string, optional): Start date
- `endDate` (string, optional): End date
- `limit` (number, optional): Number of records
- `offset` (number, optional): Pagination offset

**Response (200):**
```json
{
  "success": true,
  "data": {
    "auditLogs": [
      {
        "id": "audit_123456789",
        "userId": "user_123456789",
        "adminId": "admin_user_001",
        "action": "kyc_approved",
        "resource": "kyc_sub_123456789",
        "details": {
          "previousStatus": "under_review",
          "newStatus": "approved",
          "level": "full"
        },
        "ipAddress": "192.168.1.100",
        "userAgent": "AdminPanel/1.0",
        "timestamp": "2024-01-02T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 1250,
      "limit": 50,
      "offset": 0,
      "hasNext": true
    }
  }
}
```

### 4. Get AML Alerts

**Endpoint:** `GET /admin/aml/alerts`

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `severity` (string, optional): Filter by alert severity
- `status` (string, optional): Filter by alert status
- `limit` (number, optional): Number of alerts
- `offset` (number, optional): Pagination offset

**Response (200):**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "aml_alert_123456789",
        "userId": "user_123456789",
        "type": "suspicious_pattern",
        "severity": "medium", // "low" | "medium" | "high" | "critical"
        "status": "open", // "open" | "investigating" | "resolved" | "false_positive"
        "description": "Multiple large transactions in short timeframe",
        "details": {
          "pattern": "rapid_transactions",
          "timeframe": "24h",
          "transactionCount": 15,
          "totalAmount": 150000,
          "averageAmount": 10000
        },
        "relatedTransactions": [
          "txn_123456789",
          "txn_123456790"
        ],
        "assignedTo": "aml_analyst_001",
        "createdAt": "2024-01-01T14:00:00Z",
        "lastUpdated": "2024-01-01T16:30:00Z"
      }
    ],
    "summary": {
      "total": 23,
      "open": 15,
      "investigating": 5,
      "resolved": 3
    }
  }
}
```

### 5. Update AML Alert

**Endpoint:** `PUT /admin/aml/alerts/{alertId}`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "investigating",
  "assignedTo": "aml_analyst_002",
  "notes": "Reviewing transaction patterns and customer profile",
  "riskLevel": "medium"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "alert": {
      "id": "aml_alert_123456789",
      "status": "investigating",
      "assignedTo": "aml_analyst_002",
      "notes": "Reviewing transaction patterns and customer profile",
      "riskLevel": "medium",
      "updatedBy": "admin_user_001",
      "updatedAt": "2024-01-01T17:00:00Z"
    }
  }
}
```

---

## Notifications

### 1. Get User Notifications

**Endpoint:** `GET /v1/notifications`

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `type` (string, optional): Filter by notification type
- `read` (boolean, optional): Filter by read status
- `limit` (number, optional): Number of notifications
- `offset` (number, optional): Pagination offset

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123456789",
        "type": "transaction", // "transaction" | "security" | "kyc" | "loan" | "marketing"
        "title": "Payment Received",
        "message": "You received $1,250.00 from Acme Corp",
        "data": {
          "transactionId": "txn_123456789",
          "amount": 1250.00,
          "currency": "USD",
          "from": "Acme Corp"
        },
        "priority": "medium", // "low" | "medium" | "high"
        "read": false,
        "actionRequired": false,
        "actions": [
          {
            "type": "view_transaction",
            "label": "View Details",
            "url": "/transactions/txn_123456789"
          }
        ],
        "createdAt": "2024-01-01T09:00:00Z",
        "expiresAt": null
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "total": 25,
      "limit": 20,
      "offset": 0,
      "hasNext": true
    }
  }
}
```

### 2. Mark Notification as Read

**Endpoint:** `PUT /v1/notifications/{notificationId}/read`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 3. Get Notification Preferences

**Endpoint:** `GET /v1/notifications/preferences`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "email": {
        "transactions": true,
        "security": true,
        "kyc": true,
        "loans": true,
        "marketing": false
      },
      "push": {
        "transactions": true,
        "security": true,
        "kyc": true,
        "loans": true,
        "marketing": false
      },
      "sms": {
        "transactions": false,
        "security": true,
        "kyc": false,
        "loans": true,
        "marketing": false
      },
      "thresholds": {
        "transactionAmount": 1000.00,
        "loginFromNewDevice": true,
        "marginCall": true
      }
    }
  }
}
```

### 4. Update Notification Preferences

**Endpoint:** `PUT /v1/notifications/preferences`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "email": {
    "transactions": true,
    "security": true,
    "kyc": true,
    "loans": true,
    "marketing": false
  },
  "push": {
    "transactions": true,
    "security": true,
    "kyc": true,
    "loans": true,
    "marketing": false
  },
  "sms": {
    "transactions": false,
    "security": true,
    "kyc": false,
    "loans": true,
    "marketing": false
  },
  "thresholds": {
    "transactionAmount": 500.00,
    "loginFromNewDevice": true,
    "marginCall": true
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification preferences updated successfully"
}
```

---

## WebSocket Events

### Connection

**URL:** `wss://api.banking.com/ws`

**Authentication:** Send JWT token in connection query parameter or first message

**Connection Message:**
```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Subscription Management

**Subscribe to Channels:**
```json
{
  "type": "subscribe",
  "channels": [
    "user:123456789:balances",
    "user:123456789:transactions",
    "user:123456789:loans",
    "market:prices",
    "market:BTC-USD:trades"
  ]
}
```

**Unsubscribe from Channels:**
```json
{
  "type": "unsubscribe",
  "channels": ["market:prices"]
}
```

### Event Types

#### 1. Balance Update
```json
{
  "type": "balance_update",
  "channel": "user:123456789:balances",
  "data": {
    "accountId": "acc_usd_123",
    "currency": "USD",
    "balance": {
      "available": 12750.25,
      "ledger": 12750.25,
      "pending": 0.00,
      "reserved": 0.00
    },
    "change": {
      "amount": 250.00,
      "type": "credit",
      "reason": "transfer_received"
    },
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### 2. Transaction Update
```json
{
  "type": "transaction_update",
  "channel": "user:123456789:transactions",
  "data": {
    "transactionId": "txn_123456789",
    "status": "completed",
    "type": "transfer_received",
    "amount": 250.00,
    "currency": "USD",
    "description": "Transfer from savings",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### 3. Loan Status Update
```json
{
  "type": "loan_update",
  "channel": "user:123456789:loans",
  "data": {
    "loanId": "loan_123456789",
    "type": "margin_call",
    "message": "Margin call triggered - add collateral within 24 hours",
    "details": {
      "currentLtv": 0.78,
      "marginCallThreshold": 0.75,
      "liquidationThreshold": 0.80,
      "requiredCollateral": 0.05,
      "asset": "BTC"
    },
    "urgency": "high",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### 4. Market Price Update
```json
{
  "type": "price_update",
  "channel": "market:prices",
  "data": {
    "symbol": "BTC-USD",
    "price": 45275.50,
    "change24h": 2.15,
    "changePercent24h": 0.0475,
    "volume24h": 29100000000,
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### 5. Trade Update
```json
{
  "type": "trade",
  "channel": "market:BTC-USD:trades",
  "data": {
    "id": "trade_123456790",
    "symbol": "BTC-USD",
    "price": 45275.50,
    "size": 0.075,
    "side": "buy",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### 6. System Notification
```json
{
  "type": "notification",
  "channel": "user:123456789:notifications",
  "data": {
    "id": "notif_123456790",
    "type": "security",
    "title": "New Device Login",
    "message": "Login detected from new device in New York, NY",
    "priority": "high",
    "actionRequired": true,
    "actions": [
      {
        "type": "approve_device",
        "label": "Approve Device"
      },
      {
        "type": "block_device",
        "label": "Block Device"
      }
    ],
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Insufficient funds in account",
    "details": {
      "accountId": "acc_usd_123",
      "available": 500.00,
      "required": 1000.00,
      "currency": "USD"
    },
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "req_123456789"
  }
}
```

### Common Error Codes

#### Authentication Errors (401)
- `INVALID_TOKEN`: JWT token is invalid or expired
- `TOKEN_EXPIRED`: JWT token has expired
- `MFA_REQUIRED`: Multi-factor authentication required
- `MFA_INVALID`: Invalid MFA code provided
- `ACCOUNT_LOCKED`: Account is temporarily locked

#### Authorization Errors (403)
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `KYC_REQUIRED`: KYC verification required for this action
- `ACCOUNT_SUSPENDED`: Account is suspended
- `FEATURE_DISABLED`: Feature is disabled for this account

#### Validation Errors (400)
- `INVALID_REQUEST`: Request format is invalid
- `MISSING_REQUIRED_FIELD`: Required field is missing
- `INVALID_FIELD_VALUE`: Field value is invalid
- `AMOUNT_TOO_SMALL`: Transaction amount below minimum
- `AMOUNT_TOO_LARGE`: Transaction amount above maximum

#### Business Logic Errors (422)
- `INSUFFICIENT_FUNDS`: Not enough balance for transaction
- `DAILY_LIMIT_EXCEEDED`: Daily transaction limit exceeded
- `MONTHLY_LIMIT_EXCEEDED`: Monthly transaction limit exceeded
- `DUPLICATE_TRANSACTION`: Transaction already exists
- `ACCOUNT_FROZEN`: Account is frozen
- `UNSUPPORTED_CURRENCY`: Currency not supported

#### Resource Errors (404)
- `USER_NOT_FOUND`: User does not exist
- `ACCOUNT_NOT_FOUND`: Account does not exist
- `TRANSACTION_NOT_FOUND`: Transaction does not exist
- `LOAN_NOT_FOUND`: Loan does not exist

#### Server Errors (500)
- `INTERNAL_SERVER_ERROR`: Unexpected server error
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable
- `DATABASE_ERROR`: Database operation failed
- `EXTERNAL_SERVICE_ERROR`: External service integration failed

---

## Rate Limiting

### Rate Limit Headers

All API responses include rate limiting headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1704110400
X-RateLimit-Window: 3600
```

### Rate Limits by Endpoint Type

#### Authentication Endpoints
- Login attempts: 5 per 15 minutes per IP
- Password reset: 3 per hour per email
- MFA attempts: 10 per hour per user

#### General API Endpoints
- Standard endpoints: 1000 requests per hour per user
- Market data: 10000 requests per hour per user
- WebSocket connections: 5 concurrent per user

#### High-Risk Operations
- Transfers: 100 per day per user
- Loan applications: 5 per day per user
- KYC submissions: 3 per day per user

### Rate Limit Exceeded Response (429)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "limit": 1000,
      "window": 3600,
      "retryAfter": 1800
    },
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

---

## Data Models

### User Model
```typescript
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  accountType: 'personal' | 'business'
  kycStatus: 'pending' | 'under_review' | 'verified' | 'rejected' | 'expired'
  emailVerified: boolean
  phoneVerified: boolean
  mfaEnabled: boolean
  profilePicture?: string
  preferences: UserPreferences
  roles: string[]
  permissions: string[]
  createdAt: string
  lastLoginAt: string
  updatedAt: string
}
```

### Account Model
```typescript
interface Account {
  id: string
  userId: string
  currency: string
  type: 'checking' | 'savings' | 'crypto' | 'investment'
  name: string
  accountNumber: string
  routingNumber?: string
  status: 'active' | 'frozen' | 'closed'
  balance: Balance
  limits: AccountLimits
  features: AccountFeatures
  createdAt: string
  lastActivity: string
}
```

### Transaction Model
```typescript
interface Transaction {
  id: string
  accountId: string
  type: TransactionType
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  amount: number
  currency: string
  description: string
  reference?: string
  category?: string
  counterparty?: Counterparty
  balanceAfter: number
  fees: TransactionFees
  metadata: Record<string, any>
  createdAt: string
  completedAt?: string
}
```

### Loan Model
```typescript
interface Loan {
  id: string
  userId: string
  status: 'active' | 'paid_off' | 'defaulted' | 'cancelled'
  type: 'personal' | 'crypto_backed' | 'business'
  principal: number
  currency: string
  remainingBalance: number
  apr: number
  term: number
  monthlyPayment: number
  nextPaymentDate: string
  collateral: Collateral[]
  riskMetrics: RiskMetrics
  createdAt: string
  maturityDate: string
}
```

---

This comprehensive API documentation provides the complete structure needed to implement the backend system for the modern banking application. Each endpoint includes detailed request/response examples, error handling, and data models to ensure consistent implementation and integration with the frontend application.
