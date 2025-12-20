import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("RewardNFT", function () {
    let fundNFT: any, rewardNFT: any;
    let owner: any, addr1: any, addr2: any;
    let startAt: number | any, endAt: number | any;

    beforeEach(async function(){
        [owner, addr1, addr2] = await ethers.getSigners();
        rewardNFT = await ethers.deployContract("RewardNFT");
        await rewardNFT.waitForDeployment();
        fundNFT = await ethers.deployContract("FundNFT", [rewardNFT.getAddress()]);
        await rewardNFT.waitForDeployment();
        await rewardNFT.setFundNFT(fundNFT.getAddress());

        let blockNum = await ethers.provider.getBlockNumber();
        let latestBlock = await ethers.provider.getBlock(blockNum);
        startAt = latestBlock?.timestamp;
        endAt = (10 * 60 * 60 * 60) + startAt;
    });

    describe("Deployment & Initialization", function () {
        it("Should set correct name and symbol", async function () {
            expect(await rewardNFT.name()).to.equal("FundNFT Supporter Badge");
            expect(await rewardNFT.symbol()).to.equal("FUNDNFT");
        });

        it("Should have nextTokenId starting at 0", async function () {
            expect(await rewardNFT.nextTokenId()).to.equal(0);
        });
    });

})