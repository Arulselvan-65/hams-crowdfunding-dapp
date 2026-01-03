"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/create", label: "Create" },
        { href: "/dashboard", label: "Dashboard" },
    ];

    return (
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

                    <div className="flex items-center">
                        <div className="w-32 h-10 bg-gray-800 rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </header>
    );
}
