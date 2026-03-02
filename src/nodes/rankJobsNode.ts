import { AgentState } from "../agent/state";
import { doEmbeddings } from "../tools/embeddings";
import { cosineSimilarity } from "../tools/cosineSimilarity";

export const rankJobsNode = async(state: typeof AgentState.State) => {
    const { resumeEmbedding, jobEmbeddings } = await doEmbeddings(state.jobResults!, state.resumeData);
    
    const rankedJobs = state.jobResults!.map((job, i) => ({
        ...job,
        similarity: cosineSimilarity(resumeEmbedding, jobEmbeddings[i])
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

    return { rankedJobs };
};