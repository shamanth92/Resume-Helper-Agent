import { AgentState } from "../state";

export const searchJobsNode = (state: typeof AgentState.State) => {
    console.log("searchJobs", state.resumeData);
    return {
        jobResults: [
            { title: "Software Engineer", company: "Google", description: "Software Engineer at Google", url: "https://google.com", location: "Mountain View, CA", salary: "100000" },
            { title: "Software Engineer", company: "Facebook", description: "Software Engineer at Facebook", url: "https://facebook.com", location: "Menlo Park, CA", salary: "100000" },
            { title: "Software Engineer", company: "Amazon", description: "Software Engineer at Amazon", url: "https://amazon.com", location: "Seattle, WA", salary: "100000" },
        ]
    }
};

export const rankJobsNode = (state: typeof AgentState.State) => {
    console.log("rankJobs", state.jobResults);
    return {}
};

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