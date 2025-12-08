import { network } from "hardhat";

const { ethers, networkName } = await network.connect();

console.log(`Deploying contracts in ${networkName} network.`)

console.log("\n####### Deploying RewardNFT contract #######")
const rewardNFT = await ethers.deployContract("RewardNFT");

await rewardNFT.waitForDeployment();

console.log("RewardNFT Address:",await rewardNFT.getAddress());