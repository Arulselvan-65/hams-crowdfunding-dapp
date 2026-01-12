import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/Navbar";
import {Web3Provider} from "@/context/Web3Context";
import {ContractProvider} from "@/context/ContractContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FundNFT",
  description: "Decentralized Crowdfunding Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Web3Provider>
              <ContractProvider>
                <Navbar/>
                {children}
              </ContractProvider>
          </Web3Provider>
      </body>
    </html>
  );
}
