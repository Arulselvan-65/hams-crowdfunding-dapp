// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IFundNFT {

    function createCampaign(
        uint256 _goal,
        uint256 _startAt,
        uint256 _endAt,
        string calldata _uri
    ) external returns(uint256 campaignId);

    function pledge(uint256 campaignId) external payable;

  /*  function finalize() external;

    function claim() external;

    function refund() external;

    function getCampaign(uint256 campaignId)
    external
    view
    returns(
        address creator,
        uint256 goal,
        uint256 pledged,
        uint256 startAt,
        uint256 endAt,
        bool claimed,
        bool finalized,
        string memory metadataFolderCID,
        bool success
    );
*/
}
