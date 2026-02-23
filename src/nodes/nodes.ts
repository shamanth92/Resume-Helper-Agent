import { AgentState } from "../state";

export const selectJobNode = (state: typeof AgentState.State) => {
    console.log("selectJob", state.jobResults);
    return {
        selectedJob: state?.jobResults?.[0]
    }
};

export const analyzeGapNode = (state: typeof AgentState.State) => {
    console.log("analyzeGap", state.selectedJob);
    return {}
};

export const tailorResumeNode = (state: typeof AgentState.State) => {
    console.log("tailorResume");
    return {}
};

export const generateDocumentNode = (state: typeof AgentState.State) => {
    console.log("generateDocument");
    return {}
};