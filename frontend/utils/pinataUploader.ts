
import { Metadata } from "@/types/metadata";
import {Campaign} from "@/types/campaign";

export const pinataUploader = {
    generateAndUpload: async (campaign: Campaign) => {
        const campaignId: number = campaign.campaignId;
        const campaignTitle: string = campaign.title;

        const imageUrls: string[] = await generateAndUploadImages(campaignId);
        const metadataList: Metadata[] = generateMetadataList(imageUrls, campaignId, campaignTitle);

        try {
            const formData = new FormData();
            formData.append("campaignTitle", campaignTitle);

            for (let i = 0; i < 3; i++) {
                const file = new File(
                    [JSON.stringify(metadataList[i], null, 2)],
                    `${i}.json`,
                    { type: "application/json" }
                );
                formData.append("file", file);
            }

            const metaDataFile = new File(
                [JSON.stringify(campaign, null, 2)],
                "metadata.json",
                { type: "application/json" }
            );
            formData.append("file", metaDataFile);

            const res = await fetch("/api/files", {
                method: "POST",
                body: formData
            });
            return await res.json();
        } catch (e) {
            console.log(e);
            alert("Trouble uploading file");
        }
    }
}

const generateAndUploadImages = async (projectId: number) => {
    const imageUrls: string[] = [];

    try {
        for (let i = 0; i < 3; i++) {
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
            const cid = await uploadRequest.json();
            const signedUrl = `ipfs://${cid}`;

            imageUrls.push(signedUrl);
        }
    } catch (e) {
        console.log(e);
        alert("Trouble uploading file");
    }
    return imageUrls;
}

const generateMetadataList = (imageUrls: string[], projectId: number, campaignTitle: string) => {
    const tiers = [
        { id: "0", name: "Bronze", url: imageUrls[0] },
        { id: "1", name: "Silver", url: imageUrls[1] },
        { id: "2", name: "Gold", url: imageUrls[2] },
    ];

    const metadataList: Metadata[] = [];

    for(const tier of tiers) {
        const metadata = {
            name: `FundNFT ${tier.name} Supporter – Campaign ${projectId}`,
            description: `Exclusive ${tier.name} tier reward for supporting ${campaignTitle} on FundNFT platform.`,
            image: tier.url,
            attributes: [
                { trait_type: "Tier", value: tier.name },
                { trait_type: "Campaign ID", value: Number(projectId) },
                { trait_type: "Platform", value: "FundNFT" },
            ],
        };

        metadataList.push(metadata);
    }

    return metadataList;
}
