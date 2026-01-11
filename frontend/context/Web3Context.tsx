"use client"

import React, { createContext, useContext, useState } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";

type Web3ContextType = {
    provider: BrowserProvider | null;
    signer: JsonRpcSigner | null;
    account: string | null;
    isConnected: boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
};

const Web3Context = createContext<Web3ContextType>({
    provider: null,
    signer: null,
    account: null,
    isConnected: false,
    connectWallet: async () => {},
    disconnectWallet: () => {}
});

export function Web3Provider({ children } : { children : React.ReactNode }) {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const connectWallet = async () => {
        if(!window.ethereum){
            alert("Metamask not installed");
            return;
        }
        if(isConnected) {
            return disconnectWallet();
        }

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setAccount(address);
        setIsConnected(true);
    }

    const disconnectWallet = () => {
        setIsConnected(false);
        setProvider(null);
        setSigner(null);
        setAccount(null);
    }

    return (
        <Web3Context.Provider value={{ provider, signer, account, isConnected, connectWallet, disconnectWallet}}>
            {children}
        </Web3Context.Provider>
    )
}

export function useWeb3() {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error("useWeb3 must be used inside Web3Provider");
    }
    return context;
}