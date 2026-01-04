"use client"

import React, {DetailedHTMLProps, InputHTMLAttributes, useState} from "react";
import { pinataUploader } from "@/utils/pinataUploader";

export default function Create() {

    const [url, setUrl] = useState<string | null>(null);
    const [projectName, setProjectName] = useState<string | null>();
    const [projectId, setProjectId] = useState<string>();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);


    const uploadFile = async () => {
        const res = projectName != null ? await pinataUploader.generateAndUpload(2, projectName) : await pinataUploader.generateAndUpload(2, projectId);
        setUrl(res);
    };

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    return (
        <div className="flex h-full bg-gray-900 font-sans justify-center items-center">
            <main className="w-full max-w-2xl px-4 my-10">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-200 mb-2">Create Campaign</h2>
                    <p className="text-gray-400">Launch your project in seconds.</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-xl p-8">
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Campaign Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Open Source Drone"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Funding Goal (ETH)</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 50"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none transition"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">End Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none transition"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Description</label>
                            <textarea
                                required
                                rows={5}
                                placeholder="Tell about your project..."
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 resize-none focus:outline-none transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Cover Image</label>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-60 h-full opacity-0 cursor-pointer"
                                />

                                <div className="w-60 px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-300 text-left flex items-center justify-between hover:border-gray-600 transition">
                                    <span className="truncate">
                                        {selectedImage ? selectedImage.name : "Choose an image file..."}
                                    </span>
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 shadow-lg"
                            >
                                Create Campaign
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>

    );
}
