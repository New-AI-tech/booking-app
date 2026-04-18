# Issue Log: New-AI-tech/booking-app

## 1. Bugs & Errors
- **[Critical] Backend Fragmentation:** The application uses both Firebase and Supabase. `App.tsx` and `AvailabilityChecker.tsx` use Firebase, while `StaffDashboard.tsx` and `IncomeStatement.tsx` use Supabase. This leads to data inconsistency and broken features.
- **[Critical] Disconnected Components:** `AdminDashboard`, `StaffDashboard`, and `IncomeStatement` are not imported or used in `App.tsx`. The current UI is a simple tabbed view that doesn't route to these advanced components.
- **[Major] Firestore Permission Errors:** `firestore.rules` does not include rules for `inventory_items`, `reservations`, or `users` collections, which are actively used in the code.
- **[Minor] AI Abort Signal:** `AIService.getStylingRecommendations` checks the abort signal but doesn't pass it to the `@google/generative-ai` SDK call, meaning the actual network request isn't cancelled.

## 2. Security Vulnerabilities
- **[Major] Hardcoded Admin Email:** `App.tsx` (line 42) hardcodes `ahmedbackerjr@gmail.com` as the admin. This should be handled via custom claims or a dedicated roles collection.
- **[Major] Missing Firestore Rules:** Lack of rules for core collections (`inventory_items`, `reservations`, `users`) means they might be wide open or completely blocked depending on default settings.
- **[Minor] Exposed API Keys:** While typical for client-side apps, the `firebase-applet-config.json` is committed to the repo.

## 3. Performance Bottlenecks
- **[Major] Client-side Filtering:** `AvailabilityChecker.tsx` fetches all reservations for a dress and filters them client-side. This will become slow as the number of reservations grows.
- **[Minor] Large Bundle Size:** Vite build warns about chunks larger than 500kB (Firebase and Vendor).

## 4. Code Smells & Anti-Patterns
- **[Major] Mixed Backends:** Using two different BaaS (Firebase & Supabase) for the same app without a clear reason is a major anti-pattern.
- **[Major] Use of `any`:** `StaffDashboard.tsx` and `IncomeStatement.tsx` use `any[]` and `any` for state, losing TypeScript benefits.
- **[Minor] Inconsistent UI Language:** The main app is in English, but the disconnected dashboards are in Arabic.

## 5. Dependency Issues
- **[Major] Environment Variable Drift:** `src/config/env.ts` requires `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_PROJECT_ID`, but `firebase.ts` imports from `firebase-applet-config.json`.
- **[Minor] Outdated ESLint:** Using ESLint 8.x while 9.x is available.

## 6. Broken Tests
- **[Critical] Test Suite Failure:** `npm test` fails because `src/config/env.ts` throws an error when environment variables are missing, even during testing.

## 7. Documentation Issues
- **[Major] Incomplete README:** Setup instructions stop abruptly at `npm install`.
- **[Major] Missing .env.example:** Does not include all required variables for the app to start.
