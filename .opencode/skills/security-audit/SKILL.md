---
name: security-audit
description: Structured security audit for code, smart contracts, dependencies, scripts, webhooks. Includes Solidity red flags checklist, dependency vulnerability scanning (npm/pip-audit), secret leak detection, bash script risk signals, and skill/prompt injection audit.
license: MIT
metadata:
  source: superagent-m11
---

## Audit Output Format
```
[VERDICT] ✅ SAFE | ⚠️ CAUTION | ❌ UNSAFE
[CRITICAL FINDINGS] issue → why dangerous → evidence (file:line)
[MEDIUM/LOW] findings
[RECOMMENDATION] use as-is / modify / reject
[IF MODIFICATION] exact change
```

## Smart Contract Red Flags (Solidity)
- `tx.origin` used for auth → phishing vector
- `block.timestamp` as randomness → miner manipulation
- External call before state update → reentrancy
- Owner has mint/burn/blacklist with no timelock
- Hidden fees / disabled transfers (honeypot)

## Dependency Audit
```bash
npm audit && npm audit fix        # Node vulnerability scan
pip-audit                         # Python CVE scan
```

## Bash/Script Risk Signals
- `curl | bash` / `wget | sh` — no integrity check
- `eval` on user input
- `chmod 777` anywhere
- Reverse shells (`bash -i`, `nc -e`, `/dev/tcp/`)

## Secret Leak Detection
```bash
grep -rEn "(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{30,}|sk_live_)" .
```

## Webhook Handler Audit
- Signature verification present?
- Timing-safe comparison?
- Body parsed BEFORE verification? (should be raw bytes first)
- Idempotency on POST?
