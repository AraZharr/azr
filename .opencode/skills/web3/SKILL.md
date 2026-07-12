---
name: web3
description: EVM chain operations with ethers v6/viem — RPC fallback arrays, wallet generation (BIP39/HDNode), encrypted batch storage, transaction simulation+gas estimation+EIP-1559, ERC20 contract interaction, nonce management, mass farming patterns, token snapshots, Solana quick reference.
license: MIT
metadata:
  source: superagent-m10
---

## Stack Defaults
- EVM JS: ethers v6 or viem
- EVM Python: web3.py v7+
- Wallet gen: `ethers.Wallet.createRandom()` / BIP39 + HDNode
- Storage: .env for keys, encrypted JSON for batch wallets

## RPC Fallback Pattern
```js
function getProvider(chain) {
  const providers = RPCS[chain].map((url, i) => ({
    provider: new JsonRpcProvider(url),
    priority: i + 1, weight: 1, stallTimeout: 1500,
  }));
  return new FallbackProvider(providers, { quorum: 1 });
}
```

## Transaction Pattern
1. Simulate: `await wallet.call(tx)` — catches reverts before paying gas
2. Estimate gas with 20% buffer: `gasLimit = (gasEst * 120n) / 100n`
3. EIP-1559 fee data
4. Broadcast + wait for confirmation

## Nonce Management
```js
class NonceManager {
  async next() { /* cache + increment nonce */ }
}
```

## Mass Farming Pattern
```js
const limit = pLimit(5);
const results = await Promise.allSettled(
  wallets.map(w => limit(async () => runQuest(w)))
);
```

## Constraints
- ALWAYS simulate before broadcasting on mainnet
- Use `pending` nonce on parallel sends
- RPC fallback list, never single endpoint
- Never log private keys
- Gas buffer 20% above estimate
- Test on testnet before mainnet
