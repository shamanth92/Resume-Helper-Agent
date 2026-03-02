import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { AgentState } from "./state";
import {
    parseResumeNode,
    searchJobsNode,
    rankJobsNode,
    selectJobNode,
    analyzeGapNode,
    tailorResumeNode,
    generateDocumentNode
} from "../nodes";

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