import { StateGraph, START, END } from "@langchain/langgraph";

import { AgentState } from "./state";

import { analyzeGapNode, generateDocumentNode, parseResumeNode, rankJobsNode, searchJobsNode, selectJobNode, tailorResumeNode } from "./nodes";



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