"use client"

import { useState } from "react";
import { pinataUploader } from "@/utils/pinataUploader";

export default function Create() {

    const [url, setUrl] = useState<string | null>(null);

    const uploadFile = async () => {
        const res: string = await pinataUploader.generateAndUpload(1, "test");
        setUrl(res);
    };

    return (
        <div className="flex    h-screen bg-gray-900 font-sans justify-center items-center">
            <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
                <button type="button"  onClick={uploadFile} >
                  Generate
                </button>

                {/*{urls.length > 0 && (*/}
                {/*    <div className="mt-12">*/}
                {/*        <h2 className="text-2xl font-bold text-cyan-400 text-center mb-8">*/}
                {/*            Your Generated Reward NFTs*/}
                {/*        </h2>*/}

                {/*        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">*/}
                {/*            {urls.map((url, index) => {*/}
                {/*                const tierName = index === 0 ? "Bronze" : index === 1 ? "Silver" : "Gold";*/}

                {/*                return (*/}
                {/*                    <div*/}
                {/*                        key={index}*/}
                {/*                        className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700"*/}
                {/*                    >*/}
                {/*                        <h3 className="text-xl font-bold text-center mb-4 text-white">*/}
                {/*                            {tierName} Tier*/}
                {/*                        </h3>*/}

                                        {/* Render the SVG directly from the IPFS URL */}
                                        {/*<div className="flex justify-center">*/}
                                        {/*    <img*/}
                                        {/*        src={url}*/}
                                        {/*        alt={`${tierName} Tier NFT`}*/}
                                        {/*        className="w-full max-w-sm rounded-lg shadow-lg"*/}
                                        {/*    />*/}
                                        {/*</div>*/}

                                        <p className="text-sm text-gray-400 text-center mt-4 break-all">
                                            {url}
                                        </p>
                {/*                    </div>*/}
                {/*                );*/}
                {/*            })}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}

            </main>
        </div>
    );
}
