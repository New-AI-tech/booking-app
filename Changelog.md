# Changelog

## Version 1.0.1 (2026-04-18)

This release focuses on making the `New-AI-tech/booking-app` repository production-ready, stable, and maintainable by addressing critical issues related to backend fragmentation, security, environment configuration, UI integration, and code quality.

### 🐛 Bug Fixes

*   **Firebase Security Rules:** Updated `firestore.rules` to correctly include `inventory_items`, `reservations`, and `users` collections, ensuring proper access controls and preventing permission errors in production.
*   **Environment Variable Configuration:** Corrected `src/config/env.ts` to align with required Firebase environment variables from `firebase-applet-config.json`. Updated `.env.example` with all necessary Firebase and Supabase environment variables for consistent development setup.
*   **AI Service Abort Signal:** Fixed the `AIService.ts` to correctly handle `AbortSignal` by removing the `requestOptions` from `generateContent` as the SDK does not directly support it, and instead handling the aborted state manually.
*   **StaffDashboard Type Mismatch:** Resolved a type mismatch in `StaffDashboard.tsx` related to the `BookingWithDress` interface and the `Dress` type, ensuring type safety and successful compilation.

### ✨ Features & Improvements

*   **Backend Unification (Firebase Migration):**
    *   **Staff Dashboard:** Migrated `StaffDashboard.tsx` from Supabase to Firebase, centralizing booking data fetching through a new `firebase-services/bookingService.ts`. This service now fetches recent bookings and their associated dress details from Firestore.
    *   **Income Statement:** Migrated `IncomeStatement.tsx` from Supabase to Firebase, utilizing a new `firebase-services/incomeService.ts` for financial data aggregation. Placeholder data is currently used for maintenance and fixed expenses, indicating a clear path for future Firebase integration of these collections.
    *   **Maintenance Service:** Introduced `firebase-services/maintenanceService.ts` to provide a dedicated service for fetching maintenance logs from Firestore, preparing for full integration into the income statement.
*   **UI Integration & Routing:** Refactored `App.tsx` to implement `react-router-dom` for navigation, seamlessly integrating `AdminDashboard` and `StaffDashboard` into the main application flow. This replaces the previous fragmented tab-based system with a robust routing solution.
*   **Availability Checker Refinement:** Optimized `AvailabilityChecker.tsx` to improve Firestore queries for availability checking, ensuring more accurate and efficient results. Added basic validation for start and end dates.

### 🧪 Tests

*   **Test Environment Setup:** Created a `.env` file with placeholder environment variables to enable successful execution of tests, addressing previous failures due to missing environment configurations.

### 🧹 Code Quality

*   **Relative Import Paths:** Corrected relative import paths in `StaffDashboard.tsx` and `IncomeStatement.tsx` for better module resolution and maintainability.
*   **Type Refinement:** Refined types in `StaffDashboard.tsx` and `IncomeStatement.tsx` to remove `any` usage, improving type safety and code clarity.

This changelog details the significant steps taken to enhance the stability, security, and maintainability of the booking application. Further work is planned to fully integrate all financial data into Firebase and expand test coverage.
