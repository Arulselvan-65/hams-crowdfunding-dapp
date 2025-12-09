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

    uint256[3] public constant MIN_AMOUNTS = [
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
            metadataURI: _uri
        });

        return campaignId;
    }

    function pledge(uint256 campaignId, uint256 amount) external payable {
        require(campaignId < nextCampaignId, CampaignNotActive());
        require((block.timestamp >= c.startAt && block.timestamp <= c.endAt), CampaignNotActive());
        require(!c.finalized, CampaignEnded());
        require(msg.value > 0, InvalidAmount());

        Campaign storage c = campaigns[campaignId];
        uint256 totalPledged = c.pledged + msg.value;
        uint256 userTotal = pledges[campaignId][msg.sender] + msg.value;

        uint8 newTier = _getTier(userTotal);
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

    function _getTier(uint256 amount) private view returns(uint256 tier)  {
        tier = (0.01 <= amount <= 0.099) ? 1 : (0.10 <= amount <= 0.049) ? 2 : (amount >= 0.50) ? 3 : 255;
    }

}
