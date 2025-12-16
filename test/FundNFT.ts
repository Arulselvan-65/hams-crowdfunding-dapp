import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("FundNFT", function () {
    let fundNFT: any;
    let rewardNFT: any;
    let owner: any, addr1: any, addr2: any, addr3: any;
    let startAt: bigint, endAt: bigint;

    beforeEach(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        rewardNFT = await ethers.deployContract("RewardNFT");
        await rewardNFT.waitForDeployment();  
        fundNFT = await ethers.deployContract("FundNFT", [rewardNFT.getAddress()]);
        await fundNFT.waitForDeployment();
        await rewardNFT.setFundNFT(fundNFT.getAddress());

        const blockNum = await ethers.provider.getBlockNumber();
        const block = await ethers.provider.getBlock(blockNum);
        const currentTimestamp : number | any = block?.timestamp;
        startAt = BigInt(currentTimestamp) + 20n;
        endAt = BigInt(currentTimestamp) + BigInt(10 * 24 * 60 * 60);
    });

    describe("Deployment", function () {
        it("Should deploy the contracts", async function () {
            expect(await fundNFT.getAddress()).not.equal(null);
            expect(await rewardNFT.getAddress()).not.equal(null);
        });
    });

    describe("Campaign Creation", function () {
        it("Should create new Campaign", async function () {
            await fundNFT.createCampaign(100, startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            expect(await fundNFT.nextCampaignId()).to.equal(1);
            expect(await fundNFT.getCampaign(0)).not.equal(null);
        });

        it("Should set the campaign creator to msg.sender (the caller of createCampaign)", async function () {
            await fundNFT.createCampaign(100, startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            expect((await fundNFT.getCampaign(0)).creator).to.equal(await owner.getAddress());
        });

        it("Should revert with InvalidGoal() when goal is 0", async function () {
            expect(fundNFT.createCampaign(ethers.parseEther("0"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf"))
                .to.revertedWithCustomError(fundNFT, "InvalidGoal")
        });

        it("Should revert with InvalidStartDate() when startAt is before block timestamp", async function () {
            expect(fundNFT.createCampaign(100, startAt - 30n, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf"))
                .to.revertedWithCustomError(fundNFT, "InvalidStartDate")
        });

        it("Should revert with InvalidEndDate() when endAt is not strictly after startAt", async function () {
            expect(fundNFT.createCampaign(100, startAt, startAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf"))
                .to.revertedWithCustomError(fundNFT, "InvalidEndDate")
        });
    });

    describe("Campaign State & Getters", function () {
        it("Should return correct campaign details for a valid campaignId", async function () {
            await fundNFT.createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            const res = await fundNFT.getCampaign(0);
            expect(res.goal).to.equal(ethers.parseEther("100"));
            expect(res.startAt).to.equal(startAt);
            expect(res.endAt).to.equal(endAt);
            expect(res.creator).to.equal(await owner.getAddress());
            expect(res.pledged).to.equal(0);
            expect(res.claimed).to.equal(false);
            expect(res.finalized).to.equal(false);
            expect(res.metadataURI).to.equal("https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            expect(res.goalReached).to.equal(false);
        });

        it("Should correctly set goalReached to true when pledged >= goal", async function () {
            await fundNFT.createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            await ethers.provider.send("evm_increaseTime", [30]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("100")
            });
            const res = await fundNFT.getCampaign(0);
            expect(res.goalReached).to.equal(true);
        });

        it("Should correctly set goalReached to false when pledged < goal", async function () {
            await fundNFT.createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            await ethers.provider.send("evm_increaseTime", [30]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("80")
            });
            expect((await fundNFT.getCampaign(0)).goalReached).to.equal(false);
        });

        it("Should revert with InvalidRange() when startIndex >= endIndex", async function () {
            await fundNFT.createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            await fundNFT.connect(addr1).createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            await fundNFT.connect(addr2).createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            expect(fundNFT.getCampaigns(10, 1)).to.revertedWithCustomError(fundNFT, "InvalidRange");
        });

        it("Should return the correct campaigns in the specified range when startIndex < endIndex", async function () {
            await fundNFT.createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            await fundNFT.connect(addr1).createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            await fundNFT.connect(addr2).createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgkfcbuid");
            await fundNFT.connect(addr3).createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");

            const res = await fundNFT.getCampaigns(0, 2);
            expect(res[0].creator).to.equal(await owner.getAddress());
            expect(res[1].creator).to.equal(await addr1.getAddress());
            expect(res[2].creator).to.equal(await addr2.getAddress());
        });
    });

    describe("Pledging & Rewards", function () {
        describe("Pledging", function () {
            it("Should allow a user to pledge with valid amount during active campaign period", async function () {
                await fundNFT.createCampaign(ethers.parseEther("10"), startAt, endAt, "https://ipfs.io/jbdcusvcudbucd");
                await ethers.provider.send("evm_increaseTime", [30]);
                await ethers.provider.send("evm_mine");
                await fundNFT.pledge(0, {
                    value: ethers.parseEther("1")
                });
                expect((await fundNFT.getCampaign(0)).pledged).to.equal(ethers.parseEther("1"));
            });

            it("Should increase campaign pledged amount by msg.value", async function () {
                await fundNFT.createCampaign(ethers.parseEther("10"), startAt, endAt, "https://ipfs.io/jbdcusvcudbucd");
                await ethers.provider.send("evm_increaseTime", [30]);
                await ethers.provider.send("evm_mine");
                await fundNFT.pledge(0, {
                    value: ethers.parseEther("5")
                });
                expect((await fundNFT.getCampaign(0)).pledged).to.equal(ethers.parseEther("5"));
            });

            it("Should mint a new reward NFT with correct tier based on total pledge amount", async function () {
                await fundNFT.createCampaign(ethers.parseEther("10"), startAt, endAt, "https://ipfs.io/jbdcusvcudbucd");
                await ethers.provider.send("evm_increaseTime", [20]);
                await ethers.provider.send("evm_mine");
                await fundNFT.pledge(0, { value: ethers.parseEther("0.6") });
                await fundNFT.connect(addr1).pledge(0, { value: ethers.parseEther("0.2") });

                const tokenId1 = await fundNFT.getTokenInfo(0, owner.getAddress());
                const tokenId2 = await fundNFT.getTokenInfo(0, addr1.getAddress());

                expect((await rewardNFT.getTokenInfo(tokenId1))[1]).to.equal(2n);
                expect((await rewardNFT.getTokenInfo(tokenId2))[1]).to.equal(1n);
            });

            it("Should burn old reward NFT and mint new one when user upgrades tier by pledging more", async function () {
                await fundNFT.createCampaign(ethers.parseEther("10"), startAt, endAt, "https://ipfs.io/jbdcusvcudbucd");
                await ethers.provider.send("evm_increaseTime", [20]);
                await ethers.provider.send("evm_mine");

                await fundNFT.pledge(0, { value: ethers.parseEther("0.2") });
                let tokenId = await fundNFT.getTokenInfo(0, owner.getAddress());
                expect((await rewardNFT.getTokenInfo(tokenId))[1]).to.equal(1n);

                await fundNFT.pledge(0, { value: ethers.parseEther("0.6") });
                tokenId = await fundNFT.getTokenInfo(0, owner.getAddress());
                expect((await rewardNFT.getTokenInfo(tokenId))[1]).to.equal(2n);
            });

            it("Should revert with CampaignNotActive() if pledging before campaign startAt", async function () {
                await fundNFT.createCampaign(ethers.parseEther("10"), startAt, endAt, "https://ipfs.io/1234/jbdcusvcudbucd");
                expect(fundNFT.pledge(0, {
                    value: ethers.parseEther("0.2")
                })).to.revertedWithCustomError(fundNFT, "CampaignNotActive");
            });

            it("Should revert with CampaignNotActive() if pledging after campaign endAt", async function () {
                await fundNFT.createCampaign(ethers.parseEther("10"), startAt, endAt, "https://ipfs.io/1234/jbdcusvcudbucd");
                await ethers.provider.send("evm_increaseTime", [Number(endAt) + 10]);
                expect(fundNFT.pledge(0, {
                    value: ethers.parseEther("0.2")
                })).to.revertedWithCustomError(fundNFT, "CampaignNotActive");
            });

            it("Should revert with InvalidAmount() if msg.value is 0", async function () {
                await fundNFT.createCampaign(ethers.parseEther("10"), startAt, endAt, "https://ipfs.io/1234/jbdcusvcudbucd");
                await ethers.provider.send("evm_increaseTime", [30]);
                expect(fundNFT.pledge(0, {
                    value: ethers.parseEther("0")
                })).to.revertedWithCustomError(fundNFT, "InvalidAmount");
            });
        });
    });
});