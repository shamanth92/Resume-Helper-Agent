export type AgentStatus = "running" | "parsing_resume" | "searching_jobs" | "gap_analysis" | "ranking_jobs" | "tailoring_resume" | "waiting_for_input" | "completed" | "failed";

export interface ExecutionState {
    status: AgentStatus;
    currentNode?: string;
    data: {
        resumeData?: any;
        jobResults?: any;
        rankedJobs?: any;
        selectedJob?: any;
        tailoredResume?: any;
        gapAnalysis?: any;
        outputPath?: string;
    },
    error?: string;
    startedAt: Date;
    updatedAt: Date;
}