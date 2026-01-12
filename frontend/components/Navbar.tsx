"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWeb3 } from "@/context/Web3Context";
import {useState} from "react";

export function Navbar() {
    const pathname = usePathname();
    const { connectWallet, isConnected, account, disconnectWallet } = useWeb3();
    const [showModal, setShowModal] = useState<boolean>(false);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/create", label: "Create" },
        { href: "/dashboard", label: "Dashboard" },
    ];

    const handleConnectWallet = () => {
        if(isConnected) setShowModal(true);
        else connectWallet();
    }

    return (
        <>
            <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
                <div className="mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <Link href="/" className="flex items-center space-x-3">
                            <Image src="/logo.svg" alt="FundNFT" width={60} height={60} />
                        </Link>
                    </div>

                    <div className="flex space-x-6 items-center">
                        <nav className="hidden md:flex space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-gray-200 font-mono",
                                        pathname === link.href
                                            ? "text-cyan-400"
                                            : "hover:bg-linear-to-r hover:from-cyan-400 hover:to-blue-600 hover:bg-clip-text hover:text-transparent"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center w-32 h-10">
                            <button className="h-full w-full bg-sky-600 rounded-lg flex items-center justify-center
                                            cursor-pointer font-semibold text-md text-sky-50"
                                    onClick={handleConnectWallet}>
                                { isConnected && isConnected ? `${account?.slice(0,9)}....` : "Connect Wallet"}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

        {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setShowModal(false)}
                >
                    {/* Modal content */}
                    <div
                        onClick={e => e.stopPropagation()}
                        className="
                      bg-gray-900 border border-gray-700/50 rounded-2xl
                      w-full max-w-md p-6 shadow-2xl shadow-black/50
                      transform transition-all duration-300
                    "
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white mb-1">Wallet Connected</h2>
                            <p className="text-gray-400 text-sm">Manage your wallet</p>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/50">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <code className="text-gray-300 font-mono text-sm break-all">
                                    {account}
                                </code>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    disconnectWallet()
                                    setShowModal(false)
                                }}
                                className="
                          w-full py-3.5 rounded-xl font-medium text-white
                          bg-red-600/80 hover:bg-red-600/95
                          transition-all duration-200
                          border border-red-500/30
                          shadow-lg shadow-red-900/20
                        "
                            >
                                Disconnect Wallet
                            </button>

                            <button
                                onClick={() => setShowModal(false)}
                                className="
                          w-full py-3.5 rounded-xl font-medium
                          bg-gray-800 hover:bg-gray-700
                          text-gray-300 hover:text-white
                          transition-all duration-200
                          border border-gray-700
                        "
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
