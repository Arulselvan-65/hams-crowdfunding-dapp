# FundNFT - Decentralized Crowdfunding with NFT Rewards

**FundNFT** is a decentralized, trustless crowdfunding platform. Creators launch time-bound campaigns, backers pledge ETH, and receive tiered supporter NFT badges as proof of support. No middlemen, no custody of funds — everything happens on-chain.

## Key Features

- **All-or-Nothing Funding** — If the goal is reached by the deadline, the creator claims the funds (minus a configurable platform fee). If not, backers can fully refund their pledges.
- **Instant NFT Rewards** — Backers receive an ERC721 "Supporter Badge" NFT immediately upon pledging. Tiers upgrade automatically as you pledge more (old NFT burned, new one minted).
- **Tiered Badges** (based on total pledge per backer):
    - **Tier 0 (Bronze)**: ≥ 0.01 ETH
    - **Tier 1 (Silver)**: ≥ 0.10 ETH
    - **Tier 2 (Gold)**: ≥ 0.50 ETH
- **Metadata via IPFS** — Campaign and NFT metadata (including tier-specific images) hosted on IPFS for decentralization.
- **Secure & Protected** — ReentrancyGuard, proper checks, custom errors, and testing.
- **Permissionless** — Anyone can create a campaign or pledge.








## How It Works

1. **Creator** deploys a campaign with goal, start/end timestamps, and IPFS URI.
2. **Backers** pledge ETH during the active period → receive/upgrade NFT badge.
3. After deadline:
    - Anyone can `finalize()` the campaign.
    - If goal reached → Creator `claim()` funds.
    - If goal missed → Backers `refund()` their pledges.




## Contracts

- **FundNFT.sol** — Main crowdfunding logic, pledge/refund/claim handling.
- **RewardNFT.sol** — ERC721 badge contract with burnable tiers and dynamic tokenURI (baseURI + tier + ".json").

Built with:
- Solidity ^0.8.26
- OpenZeppelin Contracts (ReentrancyGuard, ERC721, ERC721Burnable)
- Hardhat for testing/deployment

## Testing

- Campaign creation & validation
- Pledging, tier upgrades, NFT mint/burn
- Finalization, claiming, refunds
- All edge cases and reverts

Run tests:
```bash
npx hardhat test
```

## Deployment

1. Compile: `npx hardhat compile`
2. Deploy RewardNFT first
3. Deploy FundNFT with RewardNFT address
4. Call `setFundNFT()` on RewardNFT

(Full deployment scripts available in `/scripts`)

## License

MIT

---

Built with ❤️ for the Web3 community. Feedback & contributions welcome! 🚀