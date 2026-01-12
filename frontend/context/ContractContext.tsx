"use client"

import {useContext, createContext, useState, useEffect} from "react";
import { ethers, Contract } from "ethers";
import { useWeb3 } from "@/context/Web3Context";
import { ABI } from "@/context/abi/FundNFT";

type ContractContextType = {
    createCampaign: () => Promise<string>
}

const ContractContext = createContext<ContractContextType>({
    createCampaign: async () => {return "";}
});


export function ContractProvider({children} : {children : React.ReactNode}) {
    const [contract, setContract] = useState<Contract>();
    const { signer } = useWeb3();

    useEffect(() => {
        const contract = new ethers.Contract("", ABI, signer)
    }, [])
    const createCampaign = async () => {

        return ""
    }

    return (
        <ContractContext.Provider value={{ createCampaign }}>
            {children}
        </ContractContext.Provider>
    )
}

