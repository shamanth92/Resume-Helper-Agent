import { StateGraph, START, END } from "@langchain/langgraph";

import { AgentState } from "./state";

import { analyzeGapNode, generateDocumentNode, selectJobNode, tailorResumeNode } from "./nodes/nodes";
import { searchJobsNode } from "./nodes/searchJobsNode";
import { parseResumeNode } from "./nodes/parseResumeNode";
import { rankJobsNode } from "./nodes/rankJobsNode";

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

                            .compile();