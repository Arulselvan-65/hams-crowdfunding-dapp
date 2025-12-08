// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {IRewardNFT} from "../interfaces/IRewardNFT.sol";

contract RewardNFT is ERC721, IRewardNFT {
    using Strings for uint8;

    uint256 public nextTokenId;
    address public fundNFT;

    mapping(uint256 => string) public campaignBaseURI;
    mapping(uint256 => uint256) public tokenCampaignId;
    mapping(uint256 => uint8) public tokenTier;

    error NotAllowed();
    error InvalidTier();
    error InvalidAddress();
    error CampaignNotConfigured();

    constructor() ERC721("FundNFT Supporter Badge", "FUNDNFT") {}

    modifier onlyFundNFT {
        if (msg.sender != fundNFT) revert NotAllowed();
        _;
    }

    function setFundNFT(address _fundNFT) external  {
        require(_fundNFT != address(0), InvalidAddress());
        fundNFT = _fundNFT;
    }
    function mintTo(address to, uint256 campaignId, uint8 tier) external returns (uint256 tokenId) {
        require(tier < 3, InvalidTier());
        require(bytes(campaignBaseURI[campaignId]).length > 0, CampaignNotConfigured());

        tokenId = nextTokenId++;
        tokenCampaignId[tokenId] = campaignId;
        tokenTier[tokenId] = tier;

        _safeMint(to, tokenId);
    }

    function setBaseURI(uint256 campaignId, string calldata baseURI) external {
        campaignBaseURI[campaignId] = baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);

        uint256 campId = tokenCampaignId[tokenId];
        string memory base = campaignBaseURI[campId];

        return string(abi.encodePacked(base, (tokenTier[tokenId]).toString(), ".json"));
    }

    function getTokenInfo(uint256 tokenId) external view returns (uint256 campaignId, uint8 tier) {
        return (tokenCampaignId[tokenId], tokenTier[tokenId]);
    }
}
