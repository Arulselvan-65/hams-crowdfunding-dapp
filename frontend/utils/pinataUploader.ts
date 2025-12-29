

export const pinataUploader = {
    generateAndUpload: async (projectId: string | number) => {
        const imageUrls: string[] = [];

        try {
            for (let i = 0; i < 3; i++) {
                const template = await fetch(`/templates/${i}.svg`);
                let svgText = await template.text();
                svgText = svgText.replace(/{PROJECT_ID}/g, `${projectId}`);

                const file = new File([svgText], `${i}.svg`, {type: "image/svg+xml"});

                const data = new FormData();
                data.set("file", file);
                const uploadRequest = await fetch("/api/files", {
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
}