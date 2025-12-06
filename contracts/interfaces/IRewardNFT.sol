// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IRewardNFT {

    function mintTo(address to, uint256 campaignId, uint8 tier) external returns (uint256 tokenId);

    function setBaseURI(uint256 campaignId, string calldata baseURI) external;

    function getTokenInfo(uint256 tokenId) external view returns (uint256 campaignId, uint8 tier);

}
