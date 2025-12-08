// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { IRewardNFT } from "../interfaces/IRewardNFT.sol";
import { IFundNFT } from "../interfaces/IFundNFT.sol";


contract FundNFT is IFundNFT {

    uint256 public nextCampaignId;
    address public immutable owner;
    uint256 public platformFeeTo;
    uint256 public platformFeeBps;
    IRewardNFT public immutable rewardNFT;

    uint256 public constant BRONZE = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant GOLD = 2;

    uint256 public constant MIN_AMOUNTS[3] = [
        0.01 ether,
        0.1 ether,
        0.5 ether
    ];

    struct TierConfig {
        uint256 cap;
        uint256 pledged;
        uint256 minAmount;
    }

    struct Campaign {
        address creator;
        uint256 goal;
        uint256 pledged;
        uint256 startAt;
        uint256 endAt;
        bool claimed;
        bool finalized;
        string metadataURI;
        TierConfig[3] tiers;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public pledges;

    error InvalidGoal();
    error InvalidStartDate();
    error InvalidEndDate();
    error InvalidMetaDataURI();
    error CampaignNotActive();
    error CampaignEnded();
    error InvalidAmount();
    error GoalReached();
    error NotCreator();
    error TransferFailed();
    error NoPledge();
    error AlreadyClaimed();
    error CampaignStillActive();

    constructor(address _rewardNFT){
        owner = msg.sender;
        rewardNFT = IRewardNFT(_rewardNFT);
    }

    function createCampaign(uint256 _goal, uint256 _startAt, uint256 _endAt, string calldata _uri) external returns(uint256 campaignId){
        require(_goal > 0, InvalidGoal());
        require(_startAt >= block.timestamp, InvalidStartDate());
        require(_endAt > _startAt, InvalidEndDate());
        require(bytes(_uri).length > 0, InvalidMetaDataURI());

        campaignId = nextCampaignId++;
        campaigns[campaignId] = Campaign({
            creator: msg.sender,
            goal: _goal,
            startAt: _startAt,
            endAt: _endAt,
            metadataURI: _uri,
            tiers: [
                TierConfig({ cap: _tierCaps[0], pledged: 0, minAmount: MIN_AMOUNTS[0] }),
                TierConfig({ cap: _tierCaps[1], pledged: 0, minAmount: MIN_AMOUNTS[1] }),
                TierConfig({ cap: _tierCaps[2], pledged: 0, minAmount: MIN_AMOUNTS[2] })
            ]
        });

        return campaignId;
    }

    function pledge(uint256 campaignId, uint256 amount) external payable {
        Campaign storage c = campaigns[campaignId];

        require(block.timestamp >= c.startAt, CampaignNotActive());
        require(block.timestamp <= c.endAt, CampaignEnded());
        require(!c.finalized, CampaignEnded());
        require(msg.value > 0, InvalidAmount());

        uint256 totalPledged = c.pledged + msg.value;
        uint256 userTotal = pledges[campaignId][msg.sender] + msg.value;

        if (totalPledged > c.goal) revert GoalReached();

        uint8 newTier = _getTier(newUserTotal);
        if (newTier == 255) revert InvalidAmount();

        // 4. Per-tier cap check
        uint256 newTierPledged =
            newTier == 0 ? c.bronzePledged :
                newTier == 1 ? c.silverPledged :
                    c.goldPledged;

        if (newTierPledged + msg.value >
        newTier == 0 ? c.bronzeCap :
            newTier == 1 ? c.silverCap :
                c.goldCap) revert TierCapReached();

        // 5. Burn old NFT if exists
        uint256 oldTokenId = supporterToken[campaignId][msg.sender];
        if (oldTokenId != 0) {
            rewardNFT.burn(oldTokenId);
        }

        // 6. Update state (Effects)
        c.pledged += msg.value;
        pledges[campaignId][msg.sender] += msg.value;

        if (newTier == 0) c.bronzePledged += msg.value;
        if (newTier == 1) c.silverPledged += msg.value;
        if (newTier == 2) c.goldPledged += msg.value;

        // 7. Mint new tier NFT (Interaction)
        uint256 newTokenId = rewardNFT.mintTo(msg.sender, campaignId, newTier);
        supporterToken[campaignId][msg.sender] = newTokenId;

        emit Pledged(campaignId, msg.sender, msg.value, newTier);

    }




}
