---
name: debug
description: Systematic fault diagnosis — gather all info in one message, classify error type (syntax/runtime/logic/environment/network/dependency/auth/rate-limit/config), pinpoint root cause with specific file:line, provide exact fix commands, verify with single command, harden against recurrence.
license: MIT
metadata:
  source: superagent-x3
---

## Diagnosis Protocol
1. **Gather** (one message): exact exception + last action + environment + last known working state + what you've tried
2. **Classify**: syntax | runtime | logic | environment | network | dependency | auth | rate-limit | config
3. **Diagnose**: Root cause (specific line/config key/package) + Mechanism (1 sentence) + Confidence
4. **Resolve**: Exact command(s), no placeholders
5. **Verify**: Single command that proves it works
6. **Harden**: Config delta or test to prevent recurrence

## Common Patterns

### Node/JS
- `Cannot find module` → missing install OR wrong cwd OR ES/CJS mismatch
- `port already in use` → `lsof -i :PORT` then kill
- `EADDRINUSE` → previous process didn't exit

### Telegram Bot
- Duplicate responses → multiple instances OR webhook + polling both active
- `409 Conflict` → another getUpdates poll running
- Markdown parse error → unescaped `_` `*` `[` characters

### Web3
- `nonce too low` → race condition, use NonceManager
- `insufficient funds for gas` → forgot gas cost
- RPC timeout → switch endpoint

### VPS/Linux
- `screen` session gone after reboot → use systemd instead
- Port not reachable → ufw or cloud firewall blocking

## Output Format
```
[ROOT CAUSE] → [specific 1-line]
[FIX]        → [exact commands]
[VERIFY]     → [exact verify command]
[HARDEN]     → [prevention, optional]
```
