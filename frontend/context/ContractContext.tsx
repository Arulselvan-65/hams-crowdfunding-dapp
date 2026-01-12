"use client"

import {useContext, createContext, useState, useEffect} from "react";
import { ethers, Contract } from "ethers";
import { Campaign } from "@/types/campaign";
import { useWeb3 } from "@/context/Web3Context";
import { FUNDNFT_ABI, fundNFTAddress } from "@/context/abi/FundNFT";
import { REWARDNFT_ABI, rewardNFTAddress} from "@/context/abi/RewardNFT";


type ContractContextType = {
    createCampaign: (campaign: Campaign, uri: string) => Promise<string>
}

// rnft = 0x6bee5aCd27b35600E1d929f8B55e3596c87db161
// nft = 0xba06a91BABFd154dd843971eC7f750C19086F815

const ContractContext = createContext<ContractContextType>({
    createCampaign: async (campaign, uri) => {return "";}
});


export function ContractProvider({children} : {children : React.ReactNode}) {
    const [contract, setContract] = useState<Contract>();
    const { signer, provider } = useWeb3();

    const createCampaign = async (campaign: Campaign, uri: string) => {
        console.log("Signer address:", await signer.getAddress());
        const fundNft = new ethers.Contract(fundNFTAddress, FUNDNFT_ABI, signer);
        const rewardNft = new ethers.Contract(rewardNFTAddress, REWARDNFT_ABI, signer);
        console.log("FUND: ", await rewardNft.fundNFT());
        setContract(contract);
        const tx = await fundNft.createCampaign(BigInt(campaign.fundingGoal), BigInt(campaign.startDate), BigInt(campaign.endDate), uri);

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();

        console.log("Transaction mined in block:", receipt.blockNumber);
        return contract.nextCampaignId();
    }

    return (
        <ContractContext.Provider value={{ createCampaign }}>
            {children}
        </ContractContext.Provider>
    )
}

export function useContract() {
    const contract = useContext(ContractContext);
    if (!contract) {
        throw new Error("Connect Wallet!!");
    }
    return contract;
}

