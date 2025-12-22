// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IRewardNFT} from "../interfaces/IRewardNFT.sol";
import {IFundNFT} from "../interfaces/IFundNFT.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FundNFT is IFundNFT, ReentrancyGuard {
    uint256 public nextCampaignId;
    address public immutable owner;
    address public platformFeeTo;
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
    error GoalNotReached();
    error AlreadyClaimed();
    error CampaignStillActive();
    error CampaignAlreadyFinalized();
    error InvalidRange();

    event CampaignCreated(uint256 indexed id, address creator);
    event CampaignFinalized(uint256 indexed id, bool status);
    event Pledged(uint256 indexed id, address indexed sender, uint256 value, uint8 tier);
    event FundsClaimed(uint256 indexed id, uint256 pledged, uint256 fee, uint256 creatorAmount);
    event FundsRefunded(uint256 indexed id, address indexed sender, uint256 amount);

    constructor(address _rewardNFT) {
        owner = msg.sender;
        rewardNFT = IRewardNFT(_rewardNFT);
    }

    function createCampaign(
        uint256 _goal,
        uint256 _startAt,
        uint256 _endAt,
        string calldata _uri
    ) external returns (uint256 campaignId) {
        require(_goal > 0, InvalidGoal());
        require(_startAt >= block.timestamp, InvalidStartDate());
        require(_endAt > _startAt, InvalidEndDate());
        require(bytes(_uri).length > 0, InvalidMetaDataURI());

        campaignId = nextCampaignId++;

        campaigns[campaignId] = Campaign({
            creator: msg.sender,
            goal: _goal,
            pledged: 0,
            startAt: _startAt,
            endAt: _endAt,
            claimed: false,
            finalized: false,
            metadataURI: _uri
        });

        rewardNFT.setBaseURI(campaignId, _uri);
        emit CampaignCreated(campaignId, msg.sender);
        return campaignId;
    }

    function pledge(uint256 id) external payable nonReentrant {
        require(id < nextCampaignId, CampaignNotActive());

        Campaign storage c = campaigns[id];
        require(block.timestamp >= c.startAt && block.timestamp <= c.endAt, CampaignNotActive());
        require(!c.finalized, CampaignEnded());
        require(msg.value > 0, InvalidAmount());

        uint256 userTotal = pledges[id][msg.sender] + msg.value;

        uint8 newTier = _getTier(userTotal);
        if (newTier == 255) revert InvalidAmount();

        uint256 oldTokenId = supporterToken[id][msg.sender];
        if (oldTokenId != 0) {
            rewardNFT.burn(oldTokenId);
        }

        c.pledged += msg.value;
        pledges[id][msg.sender] = userTotal;

        uint256 newTokenId = rewardNFT.mintTo(msg.sender, id, newTier);
        supporterToken[id][msg.sender] = newTokenId;

        emit Pledged(id, msg.sender, msg.value, newTier);
    }

    function setPlatformFeeInfo(address to, uint256 bps) external {
        platformFeeTo = to;
        platformFeeBps = bps;
    }

    function finalize(uint256 id) external {
        Campaign storage c = campaigns[id];
        require(block.timestamp > c.endAt, CampaignStillActive());
        require(!c.finalized, CampaignAlreadyFinalized());
        c.finalized = true;
        emit CampaignFinalized(id, c.pledged >= c.goal);
    }

    function claim(uint256 id) external nonReentrant {
        Campaign storage c = campaigns[id];

        require(c.creator == msg.sender, NotCreator());
        require(c.finalized, CampaignStillActive());
        require(c.pledged >= c.goal, GoalNotReached());
        require(!c.claimed, AlreadyClaimed());

        c.claimed = true;
        uint256 fee = (c.pledged * platformFeeBps) / 10_000;
        uint256 creatorAmount = c.pledged - fee;

        (bool sentFee, ) = platformFeeTo.call{value: fee}("");
        (bool sentCreator, ) = msg.sender.call{value: creatorAmount}("");

        require(sentFee && sentCreator, TransferFailed());
        emit FundsClaimed(id, c.pledged, fee, creatorAmount);
    }

    function refund(uint256 id) external nonReentrant {
        uint256 amount = pledges[id][msg.sender];
        require(amount > 0, NoPledge());

        Campaign storage c = campaigns[id];
        require(c.finalized, CampaignStillActive());
        require(c.pledged < c.goal, GoalReached());

        c.pledged -= amount;
        pledges[id][msg.sender] = 0;

        (bool s, ) = msg.sender.call{value: amount}("");
        require(s, TransferFailed());
        emit FundsRefunded(id, msg.sender, amount);
    }

    function getCampaign(uint256 campaignId)
    external
    view
    returns (
        address creator,
        uint256 goal,
        uint256 pledged,
        uint256 startAt,
        uint256 endAt,
        bool claimed,
        bool finalized,
        string memory metadataURI,
        bool goalReached
    )
    {
        Campaign memory c = campaigns[campaignId];

        return (
            c.creator,
            c.goal,
            c.pledged,
            c.startAt,
            c.endAt,
            c.claimed,
            c.finalized,
            c.metadataURI,
            c.pledged >= c.goal
        );
    }

    function getCampaigns(uint256 startIndex, uint256 endIndex)
    external
    view
    returns (Campaign[] memory)
    {
        require(startIndex < endIndex, InvalidRange());
        Campaign[] memory all = new Campaign[](nextCampaignId);
        for (uint256 i = startIndex; i <= endIndex; i++) {
            all[i] = campaigns[i];
        }
        return all;
    }

    function getPledgeInfo(uint256 id, address addr) external view returns (uint256) {
        return pledges[id][addr];
    }
    function getTokenInfo(uint256 campaignId, address addr) external view returns (uint256 tokenId) {
        return supporterToken[campaignId][addr];
    }

    function _getTier(uint256 amount) private pure returns (uint8 tier) {
        if (amount >= 0.50 ether) {
            return 2;
        } else if (amount >= 0.10 ether) {
            return 1;
        } else if (amount >= 0.01 ether) {
            return 0;
        }
        return 255;
    }
}