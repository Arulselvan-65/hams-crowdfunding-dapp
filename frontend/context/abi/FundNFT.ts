export const ABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_rewardNFT",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "AlreadyClaimed",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "CampaignAlreadyFinalized",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "CampaignEnded",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "CampaignNotActive",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "CampaignStillActive",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "GoalNotReached",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "GoalReached",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "InvalidAmount",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "InvalidEndDate",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "InvalidGoal",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "InvalidMetaDataURI",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "InvalidRange",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "InvalidStartDate",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "NoPledge",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "NotCreator",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "ReentrancyGuardReentrantCall",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "TransferFailed",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                }
            ],
            "name": "CampaignCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "status",
                    "type": "bool"
                }
            ],
            "name": "CampaignFinalized",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "pledged",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "fee",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "creatorAmount",
                    "type": "uint256"
                }
            ],
            "name": "FundsClaimed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "FundsRefunded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint8",
                    "name": "tier",
                    "type": "uint8"
                }
            ],
            "name": "Pledged",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "campaigns",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "goal",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "pledged",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "startAt",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "endAt",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "claimed",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "finalized",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "metadataURI",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "claim",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_goal",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_startAt",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_endAt",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_uri",
                    "type": "string"
                }
            ],
            "name": "createCampaign",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "campaignId",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "finalize",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "campaignId",
                    "type": "uint256"
                }
            ],
            "name": "getCampaign",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "goal",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "pledged",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "startAt",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "endAt",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "claimed",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "finalized",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "metadataURI",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "goalReached",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "startIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "endIndex",
                    "type": "uint256"
                }
            ],
            "name": "getCampaigns",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "goal",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "pledged",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "startAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "endAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "claimed",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "finalized",
                            "type": "bool"
                        },
                        {
                            "internalType": "string",
                            "name": "metadataURI",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct FundNFT.Campaign[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "addr",
                    "type": "address"
                }
            ],
            "name": "getPledgeInfo",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "campaignId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "addr",
                    "type": "address"
                }
            ],
            "name": "getTokenInfo",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "nextCampaignId",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "platformFeeBps",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "platformFeeTo",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "pledge",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "pledges",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "refund",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "rewardNFT",
            "outputs": [
                {
                    "internalType": "contract IRewardNFT",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "bps",
                    "type": "uint256"
                }
            ],
            "name": "setPlatformFeeInfo",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "supporterToken",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];