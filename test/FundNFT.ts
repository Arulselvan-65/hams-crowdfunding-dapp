import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("FundNFT", function () {
    let fundNFT: any;
    let rewardNFT: any;
    let owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        rewardNFT = await ethers.deployContract("RewardNFT");
        await rewardNFT.waitForDeployment();  
        fundNFT = await ethers.deployContract("FundNFT", [rewardNFT.getAddress()]);
        await fundNFT.waitForDeployment();     
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
            await fundNFT.createCampaign(100, 1765733400, 1765796580,"https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            expect(await fundNFT.nextCampaignId()).to.equal(1);
            expect(await fundNFT.getCampaign(0)).not.equal(null);
        });
    })

    

});