import { Packer } from "docx";
import { buildResumeDocument } from "../tools/buildResumeDocument";
import { AgentState } from "../agent/state";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config/env";

export const generateDocumentNode = async (state: typeof AgentState.State) => {
    console.log("Building resume...")
    const formattedResume = buildResumeDocument(state.tailoredResume!, state.resumeData!);
    const buffer = await Packer.toBuffer(formattedResume);

    const s3Client = new S3Client({ region: config.awsRegion! });
    const key = `resumes/${state.threadId}/tailored_resume.docx`;

    await s3Client.send(new PutObjectCommand({
        Bucket: config.s3Bucket!,
        Key: key,
        Body: buffer,
        ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }));

    const downloadUrl = await getSignedUrl(s3Client, new GetObjectCommand({
        Bucket: config.s3Bucket!,
        Key: key,
    }), { expiresIn: 3600 });

    if (state.executionStates && state.threadId) {
        state.executionStates.set(state.threadId, {
            ...state.executionStates.get(state.threadId)!,
            data: {
                ...state.executionStates.get(state.threadId)!.data,
                outputPath: downloadUrl
            }
        });
    }
    
    console.log("Resume generated successfully")
    return {}
}