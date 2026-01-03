"use client"

import { useState } from "react";
import { pinataUploader } from "@/utils/pinataUploader";

export default function Create() {

    const [url, setUrl] = useState<string | null>(null);
    const [projectName, setProjectName] = useState<string | null>();
    const [projectId, setProjectId] = useState<string>();


    const uploadFile = async () => {
        const res = projectName != null ? await pinataUploader.generateAndUpload(2, projectName) : await pinataUploader.generateAndUpload(2, projectId);
        setUrl(res);
    };

    async function handleCreate(e) {
        const form = e.target;


    }

    return (
        <div className="flex h-screen bg-gray-900 font-sans justify-center items-center">
            <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">

                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-2 text-gray-200">Create Campaign</h2>
                    <p className="text-gray-400 mb-8">
                        Launch your project in seconds.
                    </p>

                    <div className="card p-6">
                        <form onSubmit={handleCreate}>
                            <label className="text-gray-400">Campaign Title</label>
                            <input type="text" name="title" required className="input" placeholder="e.g. Open Source Drone"/>

                            <label className="text-gray-400">Funding Goal (ETH)</label>
                            <input type="text" onChange={(e) => setProjectName(e.target.value)} required placeholder="e.g. Open Source Drone"/>

                            <label className="text-gray-400">Duration (Days)</label>
                            <input type="number" name="duration" required className="input" defaultValue={30}/>

                            <label className="text-gray-400">Description</label>


                    <textarea
                        name="description"
                        required
                        className="input"
                        style={{ height: "120px", paddingTop: "0.5rem" }}
                        placeholder="Tell your story..."
                    ></textarea>


                            <label>Cover Image URL (Mock)</label>
                            <input type="url" name="image" required className="input" placeholder="https://..."/>

                            <button type="button" onClick={uploadFile}>
                                Create Campaign
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>

    );
}
