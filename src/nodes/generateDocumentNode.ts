import { Packer } from "docx";
import { buildResumeDocument } from "../tools/buildResumeDocument";
import { AgentState } from "../agent/state";
import * as fs from 'fs';

export const generateDocumentNode = (state: typeof AgentState.State) => {
    console.log("Building resume...")
    const formattedResume = buildResumeDocument(state.tailoredResume!, state.resumeData!);
    Packer.toBuffer(formattedResume).then((buffer) => {
        fs.writeFileSync("AgentResume-1.docx", buffer);
        console.log("✅ AgentResume-1.docx created");
    });
    return {}
}