import Image from "next/image";

export default function Home() {
  return (
    <div className="flex    h-screen bg-gray-900 font-sans justify-center items-center">
        {/*<p className="text-xl text-cyan-300 mb-8">Crowdfund projects. Earn exclusive NFT rewards.</p>*/}
        {/*<Button size="lg">Create a Campaign</Button>*/}
        <Image src="/logo.svg" alt="logo" height={500} width={500}/>

    </div>
  );
}
