
export const pinataUploader = {
    generateAndUpload: async (projectId: number, projectName: string) => {
        const imageUrls: string[] = await generateAndUploadImages(projectId);

        const tiers = [
            { id: "0", name: "Bronze", url: imageUrls[0] },
            { id: "1", name: "Silver", url: imageUrls[1] },
            { id: "2", name: "Gold", url: imageUrls[2] },
        ];

        let metaDataUrl: string = "";

        try {
            const formData = new FormData();
            for(const tier of tiers) {
                const metadata = {
                    name: `FundNFT ${tier.name} Supporter – Campaign ${projectId}`,
                    description: `Exclusive ${tier.name} tier reward for supporting "${projectName}" on FundNFT platform.`,
                    image: tier.url,
                    attributes: [
                        { trait_type: "Tier", value: tier.name },
                        { trait_type: "Campaign ID", value: Number(projectId) },
                        { trait_type: "Platform", value: "FundNFT" },
                    ],
                };

                const metadataFile = new File(
                    [JSON.stringify(metadata, null, 2)],
                    `${tier.id}.json`,
                    { type: "application/json" }
                );
                formData.append("file", metadataFile);
            }

            const res = await fetch("/api/files", {
                method: "POST",
                body: formData
            });

            metaDataUrl = await res.json();
        } catch (e) {
            console.log(e);
            alert("Trouble uploading file");
        }

        return metaDataUrl;
    }
}

const generateAndUploadImages = async (projectId: number) => {
    const imageUrls: string[] = [];

    try {
        for (let i = 0; i < 2; i++) {
            const template = await fetch(`/templates/${i}.svg`);
            let svgText = await template.text();
            svgText = svgText.replace(/{PROJECT_ID}/g, `${projectId}`);

            const file = new File([svgText], `${i}.svg`, {type: "image/svg+xml"});

            const data = new FormData();
            data.set("file", file);
            const uploadRequest = await fetch("/api/file", {
                method: "POST",
                body: data,
            });
            const signedUrl = await uploadRequest.json();
            imageUrls.push(signedUrl);
        }
    } catch (e) {
        console.log(e);
        alert("Trouble uploading file");
    }
    return imageUrls;
}