import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("FundNFT", function () {
    let fundNFT: any;
    let rewardNFT: any;
    let owner: any, addr1: any, addr2: any;
    let startAt: bigint, endAt: bigint;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        rewardNFT = await ethers.deployContract("RewardNFT");
        await rewardNFT.waitForDeployment();  
        fundNFT = await ethers.deployContract("FundNFT", [rewardNFT.getAddress()]);
        await fundNFT.waitForDeployment();

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
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            await fundNFT.createCampaign(100, startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            expect(await fundNFT.nextCampaignId()).to.equal(1);
            expect(await fundNFT.getCampaign(0)).not.equal(null);
        });

        it("Should revert with InvalidGoal() when goal is 0", async function () {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            expect(fundNFT.createCampaign(ethers.parseEther("0"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf"))
                .to.revertedWithCustomError(fundNFT, "InvalidGoal")
        });

        it("Should revert with InvalidStartDate() when startAt is before block timestamp", async function () {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            expect(fundNFT.createCampaign(100, startAt - 30n, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf"))
                .to.revertedWithCustomError(fundNFT, "InvalidStartDate")
        });

        it("Should revert with InvalidEndDate() when endAt is not strictly after startAt", async function () {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            expect(fundNFT.createCampaign(100, startAt, startAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf"))
                .to.revertedWithCustomError(fundNFT, "InvalidEndDate")
        });
    });

    describe("Campaign State & Getters", function () {
        it("Should return correct campaign details for a valid campaignId", async function () {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
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
            await rewardNFT.setFundNFT(fundNFT.getAddress());
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
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            await fundNFT.createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            await ethers.provider.send("evm_increaseTime", [30]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("80")
            });
            const res = await fundNFT.getCampaign(0);
            expect(res.goalReached).to.equal(false);
        });
    });



    

});