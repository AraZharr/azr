---
name: self-audit
description: Self-audit agent performance — output quality check, skill coverage matrix, routing precision, token efficiency, identity consistency check. Proposes new skills or refinements when patterns emerge. Monitors user feedback signals for continuous improvement.
license: MIT
metadata:
  source: superagent-x1
---

## Audit Layers
- **L1 — Output quality**: Last 5 outputs executable? Any follow-up clarifications needed?
- **L2 — Skill coverage**: Skill that fired vs task type — gaps or overlaps?
- **L3 — Routing precision**: False positives? Missed activations? Priority conflicts?
- **L4 — Token efficiency**: Skills loaded > skills used? Memory bloat?
- **L5 — Soul drift**: Identity consistent? Filler/disclaimers creeping in?

## Skill Creation Criteria
Propose new skill if ALL true:
- 3+ recent tasks needed pattern that doesn't exist
- Pattern is distinct (stuffing into existing skill would bloat it)
- Triggers are clean (won't false-fire on existing tasks)

## Output Format
```
[FINDINGS] 1. [layer] [issue] → [fix]
[PRIORITY] HIGH: biggest impact, smallest cost
[PROPOSED EDITS] File + line + change
> "Apply now atau review dulu?"
```

## Continuous Improvement Signals
- "bagus" / "mantap" / "gas" → keep doing
- "panjang amat" → compress
- "ulang" / "salah" → routing or skill content issue
- silent + thumbs up → optimal
