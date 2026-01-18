# NFL Championship Window Tracker

## Project Overview
A data visualization app that tracks NFL quarterback cap hit percentages and their correlation with championship success. The core thesis: teams with QBs under 10% cap hit win championships, teams over 15% don't.

## Tech Stack
- **Framework:** Next.js 14.2.3 (App Router)
- **Language:** TypeScript 5.4
- **Styling:** Tailwind CSS 3.4
- **Charts:** Recharts 2.12
- **Deployment:** Vercel (static export, 38 pages)

## Current State: Working

### Features Implemented
1. **Window Rankings Table** - 32-team rankings with multi-factor scoring:
   - Team Success (30%) - wins + playoff performance
   - QB Cap Hit % (25%) - lower is better
   - Head Coach Quality (20%) - tier system
   - Window Length (15%) - years until threshold
   - QB Proven Production (10%) - historical success

2. **Scatter Plot with Season Selector** - Interactive chart showing:
   - QB Cap Hit % vs Playoff Result
   - Dropdown to select seasons 2020-2025
   - Gold trophy icon for Super Bowl winners
   - LIVE badge for in-progress 2025 season
   - Color-coded zones (Elite/Favorable/Caution/Danger/Closed)

3. **Cap Trajectory Columns** - Shows 2025, 2026, 2027 projected cap %
   - Color coding for thresholds (13%+ orange, 15%+ red)
   - FA indicator for expiring contracts
   - 5th year option indicator (*)

4. **Team Detail Pages** - Individual pages for all 32 teams

5. **Window Alerts** - Smart alerts based on contract situations

### Data Files
- `lib/data/season2025.json` - Current 2025 season records (updated Jan 18, 2026)
- `lib/data/playoffResults.json` - Historical playoff data 2020-2025
- `lib/data/contracts.json` - QB contract details
- `lib/data/teams.json` - Team metadata
- `lib/data/historical.json` - Super Bowl winner history

## Key Thresholds
- **ELITE:** <6% cap hit (green)
- **FAVORABLE:** 6-10% (light green)
- **CAUTION:** 10-13% (yellow)
- **DANGER:** 13-15% (orange)
- **CLOSED:** >15% (red)

## Commands
```bash
npm run dev      # Development server on :3000
npm run build    # Production build (38 static pages)
npm run start    # Serve production build
npm run lint     # ESLint
```

## Project Structure
```
app/                    # Next.js App Router pages
components/
  charts/               # ScatterPlot, CapTrajectoryChart
  dashboard/            # WindowRankings, LeagueOverview, WindowAlerts
  ui/                   # Card, Badge, Table components
lib/
  calculations/         # Window scoring algorithms
  data/                 # JSON data files + accessor functions
  utils/                # Colors, formatting helpers
types/                  # TypeScript interfaces
```

## Known Issues
- None currently blocking

## Recent Updates (Jan 18, 2026)
- Fixed all 2025 season records to match actual Week 18 standings
- Updated playoff teams: JAX (13-4), CAR (8-9 division winner), etc.
- DET, MIN, BAL now correctly show as missed playoffs
