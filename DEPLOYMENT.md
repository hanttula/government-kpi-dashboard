# Deployment Guide — Government KPI Dashboard

## Architecture Decision: Vercel (Recommended) vs HostGator vs AWS

### TL;DR Recommendation

| Path | Best For | When to Use |
|---|---|---|
| **Vercel** (recommended) | MVP, quick launch, automatic CI/CD | Launch now; zero-cost until significant traffic |
| **HostGator** | Existing shared hosting account, PHP/MySQL backend | Only if Next.js serverless is not desired |
| **AWS** | Automated ETL, high traffic, production scale | When you need live API polling and scheduled ingestion |

---

## Option A — Vercel (Recommended MVP Path)

**Why Vercel:**
- Native Next.js deployment with zero configuration
- Free tier supports substantial traffic
- Automatic HTTPS, CDN, preview deployments per branch
- Supports ISR (Incremental Static Regeneration) for future live data updates
- No server management

**Deploy in 3 minutes:**

```bash
# 1. Install dependencies
cd government-kpi-dashboard
npm install

# 2. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/gov-kpi-dashboard.git
git push -u origin main

# 3. Connect to Vercel
# Go to vercel.com → New Project → Import from GitHub → Deploy
```

**Production build locally:**
```bash
npm run build
npm start
```

**Environment variables (none required for MVP static version).**

---

## Option B — HostGator Shared Hosting (Static Export)

HostGator shared hosting does not support Node.js servers natively on standard shared plans. Use static export.

**Steps:**

```bash
# 1. Update next.config.mjs — uncomment the static export line:
# output: 'export',

# 2. Build and export
npm install
npm run build
# This creates an 'out/' directory with static HTML/CSS/JS

# 3. Upload the 'out/' directory contents to public_html via cPanel File Manager or FTP
```

**Important notes for HostGator:**
- Remove `next/image` optimization (set `unoptimized: true` in next.config.mjs — already configured)
- All pages must use `generateStaticParams()` for dynamic routes — already implemented
- Contact form will not work (no server); replace with a mailto link or Formspree.io embed
- No ISR or live data updates — all data is baked in at build time

**HostGator + PHP backend (optional):**
If you want a PHP/MySQL backend for the contact form and future data storage:
```
/public_html/
  index.html (and other static Next.js export)
/api/
  contact.php  ← custom PHP endpoint
  config.php   ← DB credentials (outside public_html)
```

---

## Option C — AWS Production Architecture

Use this path when you need automated ETL pipelines and live data.

### Infrastructure Stack

```
Frontend          → S3 + CloudFront (static Next.js export) or EC2/ECS (SSR)
API Backend       → AWS Lambda (Node.js) or EC2 (FastAPI)
Database          → RDS PostgreSQL + TimescaleDB extension (time-series KPI data)
Cache             → ElastiCache Redis (API response caching, 15-min TTL)
ETL Scheduler     → EventBridge Cron + Lambda Functions
Secrets           → AWS Secrets Manager
DNS               → Route 53 + ACM SSL
```

### Database Schema (PostgreSQL / TimescaleDB)

```sql
-- KPI metadata table
CREATE TABLE kpis (
  id          VARCHAR(20) PRIMARY KEY,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  branch      VARCHAR(20) NOT NULL,  -- executive | legislative | judicial
  category    TEXT,
  tagline     TEXT,
  what_it_measures TEXT,
  formula     TEXT,
  why_it_matters TEXT,
  refresh_frequency VARCHAR(20),
  status      VARCHAR(20) DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Data sources
CREATE TABLE data_sources (
  id          SERIAL PRIMARY KEY,
  kpi_id      VARCHAR(20) REFERENCES kpis(id),
  name        TEXT NOT NULL,
  short_name  VARCHAR(50),
  url         TEXT,
  agency      TEXT,
  api_available BOOLEAN DEFAULT FALSE,
  update_frequency TEXT,
  notes       TEXT
);

-- Time-series KPI values (TimescaleDB hypertable)
CREATE TABLE kpi_observations (
  kpi_id      VARCHAR(20) REFERENCES kpis(id),
  observed_at TIMESTAMPTZ NOT NULL,
  value       NUMERIC,
  unit        TEXT,
  period_label TEXT,  -- "2024-Q3", "2024-10", etc.
  annotation  TEXT,
  source_id   INTEGER REFERENCES data_sources(id),
  data_quality VARCHAR(20),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
SELECT create_hypertable('kpi_observations', 'observed_at');

-- Contact requests
CREATE TABLE contact_requests (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  organization TEXT,
  request_type VARCHAR(30),
  branch      VARCHAR(20),
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  reviewed    BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_kpi_obs_kpi_id ON kpi_observations(kpi_id, observed_at DESC);
CREATE INDEX idx_kpi_branch ON kpis(branch);
```

### ETL Lambda Functions

Each data source gets its own Lambda function triggered by EventBridge cron:

```
lambdas/
  bls-cpi-ingest/         → Monthly, BLS API → kpi_observations
  fred-pce-ingest/        → Monthly, FRED API → kpi_observations
  usaspending-ingest/     → Monthly, USAspending API → kpi_observations
  congress-votes-ingest/  → Weekly, Congress.gov API → kpi_observations
  fema-declarations/      → Daily, OpenFEMA API → kpi_observations
  uscourts-stats/         → Quarterly, manual trigger → kpi_observations
```

**Sample ETL pattern (Node.js Lambda):**
```javascript
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'
import { Pool } from 'pg'

export const handler = async () => {
  // 1. Fetch from BLS API
  const res = await fetch(
    'https://api.bls.gov/publicAPI/v2/timeseries/data/',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seriesid: ['CUUR0000SA0'],  // CPI-U All Items
        startyear: '2015',
        endyear: new Date().getFullYear().toString(),
        registrationkey: process.env.BLS_API_KEY,
      }),
    }
  )
  const data = await res.json()

  // 2. Parse and upsert into TimescaleDB
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  for (const point of data.Results.series[0].data) {
    await pool.query(
      `INSERT INTO kpi_observations (kpi_id, observed_at, value, period_label, unit)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (kpi_id, observed_at) DO UPDATE SET value = EXCLUDED.value`,
      ['exec-002', `${point.year}-${point.period.replace('M', '')}-01`, point.value, `${point.year}-${point.period}`, '%']
    )
  }
}
```

### Cost Estimate (AWS, low-traffic)

| Service | Config | Monthly Cost |
|---|---|---|
| RDS PostgreSQL | db.t3.micro, 20GB | ~$25 |
| EC2 / Lambda | Lambda only | ~$1–5 |
| CloudFront + S3 | Static assets | ~$1–3 |
| ElastiCache | cache.t3.micro | ~$15 |
| **Total** | | **~$42–48/month** |

Scale up to ECS Fargate + RDS db.t3.small when traffic grows.

---

## API Keys Required (for ETL)

| API | Key Required | Free Tier | Registration |
|---|---|---|---|
| BLS Public Data API v2 | Yes (optional for v1) | 25 req/day (v1), 500/day (v2) | bls.gov/developers |
| FRED API | Yes | 120 req/min | fred.stlouisfed.org/docs/api |
| Congress.gov API | Yes | 5,000 req/hour | api.congress.gov |
| USAspending.gov | No | Unlimited | api.usaspending.gov |
| OpenFEMA | No | Unlimited | fema.gov/openfema |
| Regulations.gov | Yes | 1,000 req/hour | open.gsa.gov |

---

## Environment Variables

```env
# Database (AWS)
DATABASE_URL=postgresql://user:pass@host:5432/govkpi

# API Keys
BLS_API_KEY=your_bls_key
FRED_API_KEY=your_fred_key
CONGRESS_API_KEY=your_congress_key
REGULATIONS_API_KEY=your_regulations_key

# App
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

---

## Scaling Notes

1. **Add ISR to detail pages**: Replace `generateStaticParams` with `revalidate = 3600` for hourly cache refreshes from a live database — no full rebuilds needed.

2. **Add a `/api/kpi-data` route**: A Next.js API route can query TimescaleDB for fresh data, enabling the chart components to fetch live data client-side via SWR or React Query.

3. **Redis caching**: Cache API responses at 15-minute TTL to avoid hammering source APIs; store in ElastiCache.

4. **Geographic drill-downs**: State-level data for employment, immigration, and court statistics requires adding a `geography` dimension to `kpi_observations` and a US map component (react-simple-maps recommended).

5. **CSV/JSON export**: Add a download button on each KPI detail page that hits `/api/export?kpi=exec-001&format=csv`.
