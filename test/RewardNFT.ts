import { expect } from "chai";
import { network } from "hardhat";
const { ethers } = await network.connect();

describe("RewardNFT", function() {
    let fundNFT: any, rewardNFT: any;
    let owner: any, addr1: any, addr2: any;
    let startAt: bigint, endAt: bigint;

    beforeEach(async function() {
        [owner, addr1, addr2] = await ethers.getSigners();
        rewardNFT = await ethers.deployContract("RewardNFT");
        await rewardNFT.waitForDeployment();
        fundNFT = await ethers.deployContract("FundNFT", [rewardNFT.getAddress()]);
        await rewardNFT.waitForDeployment();

        let blockNum = await ethers.provider.getBlockNumber();
        let latestBlock = await ethers.provider.getBlock(blockNum);
        const currentTimestamp: number | any = latestBlock?.timestamp;
        startAt = BigInt(currentTimestamp) + 20n;
        endAt = BigInt(currentTimestamp) + BigInt(10 * 24 * 60 * 60);
    });

    describe("Deployment & Initialization", function() {
        it("Should set correct name and symbol", async function() {
            expect(await rewardNFT.name()).to.equal("FundNFT Supporter Badge");
            expect(await rewardNFT.symbol()).to.equal("FUNDNFT");
        });

        it("Should have nextTokenId starting at 1", async function() {
            expect(await rewardNFT.nextTokenId()).to.equal(1);
        });

        it("Should have fundNFT initially set to address(0)", async function() {
            expect(await rewardNFT.fundNFT()).to.equal(ethers.ZeroAddress);
        });
    });

    describe("setFundNFT", function() {
        it("Should allow setting fundNFT address when called by anyone (initially)", async function() {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
        });
        it("Should revert with InvalidAddress() if setting to address(0)", async function() {
            expect(rewardNFT.setFundNFT(ethers.ZeroAddress)).to.revertedWithCustomError(rewardNFT, "InvalidAddress");
        });

        it("Should allow updating fundNFT address multiple times", async function() {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            fundNFT = await ethers.deployContract("FundNFT", [rewardNFT.getAddress()]);
            await rewardNFT.waitForDeployment();
            await rewardNFT.setFundNFT(fundNFT.getAddress());
        });
    });

    describe("setBaseURI", function() {
        it("Should allow fundNFT to set base URI for a campaign", async function() {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            await fundNFT.createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            expect(await rewardNFT.getCampaignURI(0)).to.equal("https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
        });

        it("Should revert with NotAllowed() if called by non-fundNFT", async function() {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            await fundNFT.createCampaign(ethers.parseEther("100"), startAt, endAt, "https://api.ipfs.jsgfh/sdhgfjfydgfddhf");
            expect(rewardNFT.burn(0)).to.revertedWithCustomError(rewardNFT, "NotAllowed");
        });
    });

    describe("mintTo", function() {
        beforeEach(async function() {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
        })
        it("Should mint a new token with correct campaignId and tier when called by fundNFT", async function() {
            await fundNFT.createCampaign(ethers.parseEther("50"), startAt, endAt, "https://ipfss.io");
            await ethers.provider.send("evm_increaseTime", [20]);
            await ethers.provider.send("evm_mine");
            await fundNFT.connect(addr1).pledge(0, {
                value: ethers.parseEther("0.01")
            });
            expect(await rewardNFT.getTokenInfo(1)).to.eql([0n, 0n]);

            await fundNFT.connect(addr1).pledge(0, {
                value: ethers.parseEther("0.10")
            });
            expect(await rewardNFT.getTokenInfo(2)).to.eql([0n, 1n]);
        });

        it("Should increment nextTokenId correctly", async function() {
            await fundNFT.createCampaign(ethers.parseEther("10"), startAt, endAt, "https://kjdnvkjn/dkvnfdkvn");
            await ethers.provider.send("evm_increaseTime", [30]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("2")
            });
            expect(await rewardNFT.nextTokenId()).to.equal(2);
        });

        it("Should revert with NotAllowed() if called by non-fundNFT", async function() {
            expect(rewardNFT.mintTo(addr2.getAddress(), 0, 0))
                .to.revertedWithCustomError(rewardNFT, "NotAllowed");
        });

        it("Should revert with InvalidTier() if tier >= 3", async function() {
            await rewardNFT.setFundNFT(owner.getAddress());
            await expect(rewardNFT.mintTo(addr1.getAddress(), 0, 3))
                .to.be.revertedWithCustomError(rewardNFT, "InvalidTier");
        });

        it("Should revert with CampaignNotConfigured() if baseURI not set for campaignId", async function() {
            await rewardNFT.setFundNFT(owner.getAddress());
            await expect(rewardNFT.mintTo(addr1.getAddress(), 0, 1))
                .to.be.revertedWithCustomError(rewardNFT, "CampaignNotConfigured");
        });

        it("Should allow minting multiple tokens for different campaigns and tiers", async function() {
            await fundNFT.createCampaign(ethers.parseEther("20"), startAt, endAt, "https://jfnv/vkfdn/vkf");
            await fundNFT.createCampaign(ethers.parseEther("20"), startAt, endAt, "https://jfnv/37scdccdc3br34uyb/vkf");
            await ethers.provider.send("evm_increaseTime", [20]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("0.01")
            });
            await fundNFT.pledge(1, {
                value: ethers.parseEther("0.10")
            });
            expect(await rewardNFT.getTokenInfo(1)).to.eql([0n, 0n]);
            expect(await rewardNFT.getTokenInfo(2)).to.eql([1n, 1n]);
        });
    });

    describe("tokenURI", function() {

        beforeEach(async function() {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
        });

        it("Should return correct tokenURI combining baseURI + tier + '.json'", async function() {
            await fundNFT.createCampaign(ethers.parseEther("20"), startAt, endAt, "https://jfnv/vkfdn/vkf/");
            await ethers.provider.send("evm_increaseTime", [20]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("0.01")
            });
            expect(await rewardNFT.tokenURI(1)).to.eql("https://jfnv/vkfdn/vkf/0.json");
        });

        it("Should correctly handle tier 0, 1, 2 in URI", async function() {
            await fundNFT.createCampaign(ethers.parseEther("20"), startAt, endAt, "https://jfnv/vkfdn/vkf/");
            await ethers.provider.send("evm_increaseTime", [20]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("0.10")
            });
            expect(await rewardNFT.tokenURI(1)).to.eql("https://jfnv/vkfdn/vkf/1.json")
        });

        it("Should revert if token does not exist (via _requireOwned)", async function() {
            await fundNFT.createCampaign(ethers.parseEther("20"), startAt, endAt, "https://jfnv/vkfdn/vkf/");
            expect(rewardNFT.tokenURI(0)).to.revertedWithCustomError(rewardNFT, "ERC721NonexistentToken").withArgs(0);
        });
    });

    describe("burn", function() {

        beforeEach(async function() {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
        });

        it("Should allow fundNFT to burn a token", async function() {
            await rewardNFT.setFundNFT(owner.getAddress());
            await rewardNFT.setBaseURI(0, "https://djbvjdf");
            await rewardNFT.mintTo(owner.getAddress(), 0, 1);
            await rewardNFT.burn(1);
            expect(await rewardNFT.balanceOf(owner.getAddress())).to.equal(0n);
        });

        it("Should revert with NotAllowed() if called by non-fundNFT", async function() {
            await fundNFT.createCampaign(ethers.parseEther("20"), startAt, endAt, "https://7s6f5djd/vkfdn/vkf/");
            await ethers.provider.send("evm_increaseTime", [30]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("0.21")
            });

            expect(rewardNFT.burn(1)).to.revertedWithCustomError(rewardNFT, "NotAllowed");
        });

        it("Should remove token from ownership after burn", async function() {
            await fundNFT.createCampaign(ethers.parseEther("20"), startAt, endAt, "https://jfnv/vkfdn/vkf/");
            await ethers.provider.send("evm_increaseTime", [20]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("0.01")
            });
            await fundNFT.pledge(0, {
                value: ethers.parseEther("0.10")
            });

            expect(await rewardNFT.balanceOf(owner.getAddress())).to.equal(1n);
        });

        it("Should allow burning after minting", async function() {
            await rewardNFT.setFundNFT(owner.getAddress());
            await rewardNFT.setBaseURI(0, "https://djbvjdf");
            expect(rewardNFT.burn(1)).to.revertedWithCustomError(rewardNFT, "ERC721NonexistentToken").withArgs(1);
            await rewardNFT.mintTo(owner.getAddress(), 0, 1);
            await rewardNFT.burn(1);
            expect(await rewardNFT.balanceOf(owner.getAddress())).to.equal(0n);
        });
    });

    describe("getTokenInfo", function() {
        it("Should return correct campaignId and tier for a valid tokenId", async function() {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            await fundNFT.createCampaign(ethers.parseEther("20"), startAt, endAt, "https://ipfs.io/cndsiuvcgdybud");
            await ethers.provider.send("evm_increaseTime", [25]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("0.1")
            });

            expect(await rewardNFT.getTokenInfo(1)).to.eql([0n, 1n]);
        });

        it("Should revert with InvalidTokenId() if tokenId does not exist", async function() {
            expect(rewardNFT.getTokenInfo(1)).to.revertedWithCustomError(rewardNFT, "InvalidTokenId");
        });
    });

    describe("Edge Cases & Security", function() {
        it("Should prevent minting if campaign baseURI is empty string", async function() {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            await fundNFT.createCampaign(ethers.parseEther("20"), startAt, endAt, "https://ipfs.io/cndsiuvcgdybud");
            await ethers.provider.send("evm_increaseTime", [25]);
            await ethers.provider.send("evm_mine");
            await rewardNFT.setFundNFT(owner.getAddress());
            await rewardNFT.setBaseURI(0, "");
            await rewardNFT.setFundNFT(fundNFT.getAddress());

            expect(fundNFT.pledge(0, {
                value: ethers.parseEther("0.1")
            }))
                .to.revertedWithCustomError(rewardNFT, "CampaignNotConfigured");
        });

        it("Should maintain correct state after multiple mints and burns", async function() {
            await rewardNFT.setFundNFT(fundNFT.getAddress());
            await fundNFT.createCampaign(ethers.parseEther("20"), startAt, endAt, "https://ipfs.io/cndsiuvcgdybud");
            await ethers.provider.send("evm_increaseTime", [25]);
            await ethers.provider.send("evm_mine");
            await fundNFT.pledge(0, {
                value: ethers.parseEther("0.01")
            });
            await fundNFT.pledge(0, {
                value: ethers.parseEther("0.5")
            });

            expect(await rewardNFT.nextTokenId()).to.equal(3);
            expect(await rewardNFT.getTokenInfo(2)).to.eql([0n, 2n]);
        });
    });
});