# TraderBuddy MVP

A Next.js 14 trading journal application built with TypeScript and Tailwind CSS.

## Features

- **Login Page** - Simple authentication form (no real auth for MVP)
- **Dashboard** - View trading metrics (Today PnL, Win Rate, Total Trades, Avg R) and recent trades
- **New Trade Entry** - Add new trades with full details
- **Trade Details** - View individual trade details with AI Review section

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- In-memory data store (no database)

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Open PowerShell or Command Prompt** in the project directory:
   ```
   cd "C:\Users\thesu\Desktop\TraderBuddy TraderIPpro"
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Start the development server**:
   ```
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

The app will automatically redirect to the login page.

## How to Test

Follow this click path to test all features:

### 1. Login Page (`/login`)
   - ✅ Verify the login form is displayed
   - ✅ Enter any email and password (validation is basic)
   - ✅ Click "Sign In" button
   - ✅ Should redirect to `/dashboard`

### 2. Dashboard (`/dashboard`)
   - ✅ Verify 4 metric cards are displayed:
     - Today PnL
     - Win Rate
     - Total Trades
     - Avg R
   - ✅ Verify "Last 10 Trades" table shows mocked trades
   - ✅ Click "New Trade" button
   - ✅ Should navigate to `/trades/new`
   - ✅ Click "View" on any trade in the table
   - ✅ Should navigate to `/trades/[id]`

### 3. New Trade Form (`/trades/new`)
   - ✅ Fill in all required fields:
     - Instrument (e.g., "EUR/USD")
     - Direction (select Long or Short)
     - Entry Price (e.g., 1.0850)
     - Stop Price (e.g., 1.0820)
     - Take Profit Price (e.g., 1.0920)
     - Quantity (e.g., 1)
     - Entry Time (select date/time)
     - Exit Time (select date/time)
   - ✅ Optionally fill Exit Price
   - ✅ Add notes (optional)
   - ✅ Click "Save Trade"
   - ✅ Should redirect back to `/dashboard`
   - ✅ Verify new trade appears in the table
   - ✅ Test validation:
     - Try submitting with empty required fields
     - Try entering non-numeric values for prices
     - Try selecting invalid direction

### 4. Trade Detail Page (`/trades/[id]`)
   - ✅ Verify all trade information is displayed correctly
   - ✅ Verify AI Review section shows:
     - Strengths (green indicator)
     - Mistakes (yellow indicator)
     - Next Actions (blue indicator)
     - Risk Flags (red indicator, if applicable)
   - ✅ Click "Back" button
   - ✅ Should return to previous page

### 5. Navigation Flow
   - ✅ Test browser back/forward buttons
   - ✅ Test direct URL navigation (e.g., `/dashboard`, `/trades/new`)
   - ✅ Verify all links and buttons work correctly

## Project Structure

```
TraderBuddy TraderIPpro/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard with metrics and trade table
│   ├── login/
│   │   └── page.tsx           # Login form
│   ├── trades/
│   │   ├── new/
│   │   │   └── page.tsx       # New trade entry form
│   │   └── [id]/
│   │       └── page.tsx       # Trade detail page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (redirects to login)
│   └── globals.css            # Global styles with Tailwind
├── lib/
│   └── store.ts               # In-memory trade data store
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Notes

- **No Database**: All data is stored in-memory and will reset on page refresh
- **No Real Authentication**: Login form accepts any credentials
- **Mocked AI Review**: AI Review section shows static mocked data
- **Session-based**: Trades added during a session persist until page refresh

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Next Steps (Future Enhancements)

- Add real database integration
- Implement actual authentication
- Connect to real AI API for trade reviews
- Add trade editing and deletion
- Implement data persistence
- Add charts and visualizations
- Export trade data to CSV/PDF
