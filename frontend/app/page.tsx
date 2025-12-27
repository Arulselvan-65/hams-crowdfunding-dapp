import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white text-xl">
            FN
          </div>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">FundNFT</span>
          </h1>
            <p className="text-xl text-cyan-300 mb-8">Crowdfund projects. Earn exclusive NFT rewards.</p>
            <Button size="lg">Create a Campaign</Button>
        </div>
      </main>
    </div>
  );
}
