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
    mapping(uint256 => mapping(address => uint256)) public supporterToken;

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
            pledged: 0,
            finalized: false,
            claimed: false
        });
        rewardNFT.setBaseURI(campaignId, _uri);
        return campaignId;
    }

    function pledge(uint256 campaignId) external payable {
        require(campaignId < nextCampaignId, CampaignNotActive());

        Campaign storage c = campaigns[campaignId];
        require((block.timestamp >= c.startAt && block.timestamp <= c.endAt), CampaignNotActive());
        require(!c.finalized, CampaignEnded());
        require(msg.value > 0, InvalidAmount());

        uint256 userTotal = pledges[campaignId][msg.sender] + msg.value;

        uint8 newTier = _getTier(userTotal);
        if (newTier == 255) revert InvalidAmount();

        uint256 oldTokenId = supporterToken[campaignId][msg.sender];
        if (oldTokenId != 0) {
            rewardNFT.burn(oldTokenId);
        }

        c.pledged += msg.value;
        pledges[campaignId][msg.sender] =userTotal;
        uint256 newTokenId = rewardNFT.mintTo(msg.sender, campaignId, newTier);
        supporterToken[campaignId][msg.sender] = newTokenId;
//        emit Pledged(campaignId, msg.sender, msg.value, newTier);
    }

    function _getTier(uint256 amount) private pure returns(uint8 tier)  {
        if (amount >= 0.50 ether) {
            return 2;
        }
        if (amount >= 0.10 ether) {
            return 1;
        }
        if (amount >= 0.01 ether) {
            return 0;
        }
        return 255;
    }

}
