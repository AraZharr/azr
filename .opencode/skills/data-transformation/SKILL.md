---
name: data-transformation
description: Data pipeline with pandas, 100K+ row chunked processing, O(1) lookup structures (Set/SQLite), streaming JSON (ijson), crypto-specific patterns (holder snapshot, transaction analysis, wallet bundling detection), with 3 actionable prescriptions per output.
license: MIT
metadata:
  source: superagent-m5
---

## Processing Flow
SCOPE → ACQUIRE → NORMALIZE → PROCESS → RENDER → PRESCRIBE

## Large Dataset Patterns
- **Chunked reading**: `pd.read_csv('huge.csv', chunksize=50_000)` — filter early
- **O(1) lookup**: Load addresses into `Set` (~200K → ~12MB RAM)
- **SQLite**: For 1M–10M rows, `CREATE INDEX` for fast lookup
- **Streaming JSON**: `ijson` for files that won't fit in memory

## Performance Indicators (always compute)
- throughput: total + period-over-period delta (%)
- activity: active + new + lapsed units
- efficiency: input → qualified → converted (%)
- distribution: p50, p90, p99 (not just mean — mean lies on skewed data)

## Crypto-Specific Patterns
- Token holder snapshot: top 10 concentration, distribution quantiles
- Transaction spam detection: group by from_address, high tx count + low unique_to ratio
- Wallet bundling: wallets funded from same source = likely same operator

## Output Constraints
- Generate ACTUAL output file (not inline-only summary)
- Always include delta/trend
- Numeric outputs: units + thousands separator
- Always close with exactly 3 specific executable prescriptions
