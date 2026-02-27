import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { AgentState } from "./state";
import { searchJobsNode } from "./nodes/searchJobsNode";
import { parseResumeNode } from "./nodes/parseResumeNode";
import { rankJobsNode } from "./nodes/rankJobsNode";
import { selectJobNode } from "./nodes/selectJobNode";
import { analyzeGapNode } from "./nodes/analyzeGapsNode";
import { tailorResumeNode } from "./nodes/tailorResumeNode";
import { generateDocumentNode } from "./nodes/generateDocumentNode";

export const graph = new StateGraph(AgentState)

    .addNode("parseResume", parseResumeNode)

    .addNode("searchJobs", searchJobsNode)

    .addNode("rankJobs", rankJobsNode)

    .addNode("selectJob", selectJobNode)

    .addNode("analyzeGap", analyzeGapNode)

    .addNode("tailorResume", tailorResumeNode)

    .addNode("generateDocument", generateDocumentNode)

    .addEdge(START, "parseResume")

    .addEdge("parseResume", "searchJobs")

    .addEdge("searchJobs", "rankJobs")

    .addEdge("rankJobs", "selectJob")

    .addEdge("selectJob", "analyzeGap")

    .addEdge("analyzeGap", "tailorResume")

    .addEdge("tailorResume", "generateDocument")

    .addEdge("generateDocument", END)

    .compile({
        checkpointer: new MemorySaver()
});