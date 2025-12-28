'use client';

import { useState } from 'react';

export default function NFTPreviewGenerator() {
    const [projectId, setProjectId] = useState('');
    const [bronzeSvg, setBronzeSvg] = useState<string | null>(null);
    const [silverSvg, setSilverSvg] = useState<string | null>(null);
    const [goldSvg, setGoldSvg] = useState<string | null>(null);

    const generateNFTs = () => {
        if (!projectId.trim()) {
            alert('Please enter a Project ID');
            return;
        }

        const id = projectId.trim();

        // Bronze Tier SVG
        const bronze = `
<svg width="400" height="250" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cd7f32">
        <animate attributeName="stop-color" values="#cd7f32;#e3a46b;#cd7f32" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#8c4b20"/>
    </linearGradient>
  </defs>

  <rect width="400" height="250" rx="20" fill="url(#bronzeGrad)"/>
  
  <text x="200" y="60" text-anchor="middle" font-size="28" font-family="sans-serif" font-weight="bold" fill="#fff">
    BRONZE TIER
  </text>

  <rect x="50" y="140" width="300" height="60" rx="15" fill="rgba(0,0,0,0.4)"/>
  
  <text x="200" y="175" text-anchor="middle" font-size="22" font-family="monospace" fill="#fff">
    Project ID: ${id}
  </text>
</svg>`;

        // Silver Tier SVG
        const silver = `
<svg width="400" height="250" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c0c0c0">
        <animate attributeName="stop-color" values="#c0c0c0;#e8e8e8;#c0c0c0" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#888888"/>
    </linearGradient>
  </defs>

  <rect width="400" height="250" rx="20" fill="url(#silverGrad)"/>
  
  <text x="200" y="60" text-anchor="middle" font-size="28" font-family="sans-serif" font-weight="bold" fill="#333">
    SILVER TIER
  </text>

  <rect x="50" y="140" width="300" height="60" rx="15" fill="rgba(0,0,0,0.3)"/>
  
  <text x="200" y="175" text-anchor="middle" font-size="22" font-family="monospace" fill="#fff">
    Project ID: ${id}
  </text>
</svg>`;

        // Gold Tier SVG
        const gold = `
<svg width="400" height="250" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffd700">
        <animate attributeName="stop-color" values="#ffd700;#ffed99;#ffd700" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#b8860b"/>
    </linearGradient>
  </defs>

  <rect width="400" height="250" rx="20" fill="url(#goldGrad)"/>
  
  <text x="200" y="60" text-anchor="middle" font-size="28" font-family="sans-serif" font-weight="bold" fill="#333">
    GOLD TIER
  </text>

  <rect x="50" y="140" width="300" height="60" rx="15" fill="rgba(0,0,0,0.4)"/>
  
  <text x="200" y="175" text-anchor="middle" font-size="22" font-family="monospace" fill="#fff">
    Project ID: ${id}
  </text>
</svg>`;

        setBronzeSvg(bronze);
        setSilverSvg(silver);
        setGoldSvg(gold);
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-center mb-8">NFT Reward Preview Generator</h1>

            <div className="flex flex-col items-center gap-6 mb-12">
                <input
                    type="text"
                    placeholder="Enter Project ID (e.g., 42)"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="px-6 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 w-80"
                />

                <button
                    onClick={generateNFTs}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition shadow-lg"
                >
                    Generate 3 Tier NFTs
                </button>
            </div>

            {(bronzeSvg || silverSvg || goldSvg) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {bronzeSvg && (
                        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
                            <h3 className="text-xl font-bold text-center text-amber-400 mb-4">Bronze Tier</h3>
                            <div dangerouslySetInnerHTML={{ __html: bronzeSvg }} />
                        </div>
                    )}

                    {silverSvg && (
                        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
                            <h3 className="text-xl font-bold text-center text-gray-300 mb-4">Silver Tier</h3>
                            <div dangerouslySetInnerHTML={{ __html: silverSvg }} />
                        </div>
                    )}

                    {goldSvg && (
                        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
                            <h3 className="text-xl font-bold text-center text-yellow-400 mb-4">Gold Tier</h3>
                            <div dangerouslySetInnerHTML={{ __html: goldSvg }} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}