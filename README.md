# Government KPI Dashboard

A production-ready civic transparency website that aggregates publicly available government data into easy-to-understand dashboards across the Executive, Legislative, and Judicial branches of the U.S. federal government.

**Live demo**: Deploy to Vercel in minutes (see below)

---

## What This Is

A nonpartisan, source-transparent public performance dashboard with:

- **30 KPIs** across all 3 branches of government
- Historical trend charts with benchmark lines
- Full data source attribution with API availability flags
- Data quality ratings and explicit caveats
- Search and filter by branch, category, and update frequency
- KPI detail pages with formulas, methodology, and drill-down options
- Contact/request form for community KPI suggestions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Data | Static TypeScript data files (MVP) |
| Deployment | Vercel (recommended) |

---

## Quick Start

```bash
git clone <your-repo>
cd government-kpi-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
government-kpi-dashboard/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home
│   ├── kpi-library/page.tsx      # Full KPI search/filter
│   ├── executive/
│   │   ├── page.tsx              # Executive branch landing
│   │   └── [slug]/page.tsx       # KPI detail pages
│   ├── legislative/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── judicial/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── data-sources/page.tsx     # Data source index
│   ├── methodology/page.tsx      # Methodology documentation
│   └── contact/page.tsx          # Request / contact form
│
├── components/
│   ├── layout/                   # Header, Footer
│   ├── ui/                       # BranchBadge, DataFreshness, SourceCard, CaveatBanner
│   ├── kpi/                      # KPICard, KPIDetailView, BranchLandingPage
│   ├── charts/                   # TrendChart, MetricStatCard
│   └── search/                   # KPISearch (client component with filters)
│
├── data/
│   └── kpis/
│       ├── executive.ts          # 10 executive KPIs with seed data
│       ├── legislative.ts        # 10 legislative KPIs with seed data
│       ├── judicial.ts           # 10 judicial KPIs with seed data
│       └── index.ts              # Aggregation + query helpers
│
├── lib/
│   ├── types.ts                  # TypeScript interfaces for KPI, DataSource, etc.
│   └── utils.ts                  # Formatting, branch config, class utilities
│
├── DEPLOYMENT.md                 # Vercel, HostGator, and AWS deployment guides
└── README.md
```

---

## KPI Catalog

### Executive Branch (10 KPIs)
| ID | KPI | Category | Source |
|---|---|---|---|
| exec-001 | Federal Budget Execution Accuracy | Fiscal Management | USAspending, Treasury |
| exec-002 | Inflation Trend vs. Target | Macroeconomic | BLS, FRED, BEA |
| exec-003 | Employment Growth Rate | Macroeconomic | BLS CES/CPS |
| exec-004 | Federal Agency Service Delivery Time | Agency Operations | SSA, VA, USCIS |
| exec-005 | National Debt Growth Rate | Fiscal Management | TreasuryDirect, CBO, FRED |
| exec-006 | Disaster Response Speed | Emergency Management | FEMA OpenFEMA API |
| exec-007 | Federal Procurement Efficiency | Agency Operations | USAspending, SAM.gov |
| exec-008 | Regulatory Processing Time | Regulatory Activity | Federal Register, Regulations.gov |
| exec-009 | Immigration Case Throughput | Border & Immigration | EOIR, USCIS, CBP |
| exec-010 | Public Trust Index | Public Confidence | Pew, Gallup, ANES |

### Legislative Branch (10 KPIs)
| ID | KPI | Category | Source |
|---|---|---|---|
| leg-001 | Bill Passage Efficiency | Legislative Output | Congress.gov, GovTrack |
| leg-002 | Federal Budget Timeliness | Fiscal Responsibility | Congress.gov, CRS |
| leg-003 | Committee Hearing Productivity | Oversight Activity | Congress.gov, ProPublica |
| leg-004 | Bipartisan Voting Rate | Legislative Process | GovTrack, VoteSmart |
| leg-005 | Constituent Responsiveness | Constituent Service | Demand Progress |
| leg-006 | Congressional Attendance Rate | Member Performance | GovTrack, ProPublica |
| leg-007 | Oversight Effectiveness | Oversight Activity | GAO, CIGIE |
| leg-008 | Legislative Cycle Time | Legislative Process | Congress.gov, GovTrack |
| leg-009 | Lobbying Transparency Compliance | Transparency & Ethics | Senate LDA, OpenSecrets |
| leg-010 | Congressional Public Approval | Public Confidence | Gallup, RCP |

### Judicial Branch (10 KPIs)
| ID | KPI | Category | Source |
|---|---|---|---|
| jud-001 | Case Clearance Rate | Court Capacity | USCOURTS, FJC |
| jud-002 | Average Case Resolution Time | Court Efficiency | USCOURTS, FJC |
| jud-003 | Court Backlog Volume | Court Capacity | USCOURTS, EOIR |
| jud-004 | Appellate Reversal Rate | Judicial Quality | USCOURTS, SCOTUSblog |
| jud-005 | Pretrial Detention Duration | Criminal Justice | BJS, FJC |
| jud-006 | Judicial Vacancy Rate | Court Capacity | USCOURTS, FJC |
| jud-007 | Access to Counsel Rate | Access to Justice | CJA, BJS |
| jud-008 | Digital Court Access | Access to Justice | PACER, USCOURTS |
| jud-009 | Sentencing Consistency | Judicial Quality | U.S. Sentencing Commission |
| jud-010 | Public Confidence in Courts | Public Confidence | Gallup, Pew, Marquette |

---

## Adding New KPIs

1. Add a new KPI object to the appropriate file in `data/kpis/`
2. Follow the `KPI` interface defined in `lib/types.ts`
3. Include `dataSources`, `dataCaveats`, `historicalData`, and `metric`
4. Set `status: 'active'` or `'planned'`
5. The KPI will automatically appear in the library, branch page, and get a detail page via `generateStaticParams`

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Vercel (1-click recommended)
- HostGator static export
- AWS full production architecture with ETL pipeline
- Database schema (PostgreSQL + TimescaleDB)
- API key requirements
- ETL Lambda patterns

---

## Design Principles

- **Nonpartisan**: No political scoring, no composite grades, no advocacy
- **Source-transparent**: Every figure links to its primary source
- **Caveat-honest**: Data quality ratings and caveats on every KPI
- **Trend-first**: Multi-year historical context over single snapshots
- **Accessible**: WCAG-compliant contrast, mobile-responsive, semantic HTML

---

## License

MIT. Data is from public government sources and is in the public domain.
