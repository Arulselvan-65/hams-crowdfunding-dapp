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

        it("Should have fundNFT initially set to address(0)", async function () {
            expect(await rewardNFT.fundNFT()).to.equal(ethers.ZeroAddress);
        });
    });

    describe("setFundNFT", function () {
        it("Should allow setting fundNFT address when called by anyone (initially)", async function () {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
        });
        it("Should revert with InvalidAddress() if setting to address(0)", async function () {
            expect(rewardNFT.setFundNFT(ethers.ZeroAddress)).to.revertedWithCustomError(rewardNFT, "InvalidAddress");
        });

        it("Should allow updating fundNFT address multiple times", async function () {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            fundNFT = await ethers.deployContract("FundNFT", [rewardNFT.getAddress()]);
            await rewardNFT.waitForDeployment();
            await rewardNFT.setFundNFT(fundNFT.getAddress());
        });
    });

})