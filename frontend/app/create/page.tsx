"use client"

import Image from "next/image";
import { useState } from "react";

export default function Create() {

    const [file, setFile] = useState<File>();
    const [url, setUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    const uploadFile = async () => {
        try {
            if (!file) {
                alert("No file selected");
                return;
            }

            setUploading(true);
            const data = new FormData();
            data.set("file", file);
            const uploadRequest = await fetch("/api/files", {
                method: "POST",
                body: data,
            });
            const signedUrl = await uploadRequest.json();
            setUrl(signedUrl);
            setUploading(false);
        } catch (e) {
            console.log(e);
            setUploading(false);
            alert("Trouble uploading file");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target?.files?.[0]);
    };

    return (
        <div className="flex    h-screen bg-gray-900 font-sans justify-center items-center">
            {/*<p className="text-xl text-cyan-300 mb-8">Crowdfund projects. Earn exclusive NFT rewards.</p>*/}
            {/*<Button size="lg">Create a Campaign</Button>*/}
            <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
                <input type="file" onChange={handleChange} />
                <button type="button" disabled={uploading} onClick={uploadFile} >
                    {uploading ? "Uploading..." : "Upload"}
                </button>

                {url && (
                    <><img src={url} alt="Image from Pinata"/><p>{url}</p></>)
                }
            </main>
        </div>
    );
}
