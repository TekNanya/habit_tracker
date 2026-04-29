# Habit Tracker PWA

## Overview
A mobile-first Progressive Web App for tracking daily habits, built with Next.js and LocalStorage.

## Setup & Run
1. Install: `npm install`
2. Run Dev: `npm run dev`
3. Build: `npm run build`

## Testing
- Unit: `npm run test:unit`
- Integration: `npm run test:integration`
- E2E: `npm run test:e2e`

## Implementation Details
- **Persistence**: Uses `localStorage` with keys `habit-tracker-users`, `habit-tracker-session`, and `habit-tracker-habits`.
- **PWA**: Implemented via `manifest.json` and a custom Service Worker for offline shell caching.
- **Auth**: Deterministic local authentication with session management.

## Test Mapping
- `tests/unit/slug.test.ts`: Verifies slug generation logic.
- `tests/unit/streaks.test.ts`: Validates streak calculation and edge cases.
- `tests/integration/auth-flow.test.tsx`: Checks signup/login workflows.
- `tests/e2e/app.spec.ts`: End-to-end user journey validation.