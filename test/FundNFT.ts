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


});