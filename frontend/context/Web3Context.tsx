"use client"

import React, { createContext, useContext, useState } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";

type Web3ContextType = {
    provider: BrowserProvider | null;
    signer: JsonRpcSigner | null;
    account: string | null;
    connectWallet: () => Promise<void>;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children } : { children : React.ReactNode }) {
    const [provider, setProvider] = useState<BrowserProvider | null>();
    const [signer, setSigner] = useState<JsonRpcSigner | null>();
    const [account, setAccount] = useState<string | null>();

    const connectWallet = async () => {
        if(!window.ethereum){
            alert("Metamask not installed");
            return;
        }

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setAccount(address)
    }

    return (
        <Web3Context.Provider value={{ provider, signer, account, connectWallet}}>
            {children}
        </Web3Context.Provider>
    )
}