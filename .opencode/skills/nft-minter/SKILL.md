---
name: nft-minter
description: Universal NFT minting — parse any input (OpenSea URL, Manifold claim, Zora link, raw contract), auto-detect mint function from 10+ signatures, detect mint price, auto-gas (EIP-1559 + buffer), simulate before sending. Supports Seadrop, Manifold, Zora 1155 protocols.
license: MIT
metadata:
  source: superagent-m13
---

## Input Parsing
- OpenSea URL → `opensea.io/assets/<chain>/<contract>/<id>`
- Manifold claim → `manifold.xyz/c/<id>`
- Zora → `zora.co/collect/<chain>:<contract>/<token>`
- Direct: `0xABC... on base 5`

## Auto-Detect Mint Function
Tries signatures in order (mint(uint256), mint(), claim(uint256), mintPublic, Seadrop, Zora 1155, ERC1155). First one that exists on contract wins.

## Auto-Detect Price
Tries: `mintPrice()`, `price()`, `cost()`, `PRICE()`, `publicSalePrice()`.
Last resort: simulate with 0 value, parse revert.

## Auto Gas
- EIP-1559: baseFee*2 + priorityFee*1.1
- 20% gas buffer above estimate
- Priority: +10% to land faster

## One-Shot CLI
```bash
node mint.js https://opensea.io/assets/base/0xABC.../1
node mint.js 0xABC... base
node mint.js 0xABC... ethereum 3
```

## Special Protocols
- **OpenSea Seadrop**: `0x00005EA00Ac477B1030CE78506496e8C2dE24bf5` — mintPublic with feeRecipient
- **Manifold**: `0x44e94034afce2dd3cd5eb62528f239686fc8f162` — claim-based mint
- **Zora 1155**: `0x777777722D078c97c6ad07d9f36801e653E356Ae` — mintWithRewards

## Failure Modes
- `NotEnabled` → public mint not active
- `InsufficientFunds` → price miscalculated
- `AlreadyMinted` → wallet hit per-wallet cap
- `InvalidMerkleProof` → allowlist-only mint
