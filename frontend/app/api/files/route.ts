"use server"

import {NextResponse, NextRequest} from "next/server";
import {pinata} from "@/utils/config";


export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const projectName: string | null = data.get("projectName") as unknown as string;
        const files: File[] = [];

        for (const entry of data.entries()) {
            if (entry[0] === "file") {
                const file = entry[1] as File;
                if (file.size > 0) { files.push(file); }
            }
        }

        if (files.length === 0) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        const upload = await pinata.upload.public
            .fileArray(files)
            .name(projectName)

        const { cid } = upload;
        const url = await pinata.gateways.public.convert(cid) + "?pinataGatewayToken=" + `${process.env.GATEWAY_KEY}`;

        return NextResponse.json(url, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}