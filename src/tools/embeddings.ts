import { OpenAIEmbeddings } from "@langchain/openai";

export const doEmbeddings = async (jobResults: any[], resumeData: any) => {
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });

    const resumeText = JSON.stringify(resumeData);
    const resumeEmbedding = (await embeddings.embedDocuments([resumeText]))[0];
    const jobEmbeddings = await Promise.all(
        jobResults.map(async (job) => {
            const jobText = `${job.job_title} at ${job.employer_name}. ${job.job_description}`;
            return (await embeddings.embedDocuments([jobText]))[0];
        })
    );

    return {
        resumeEmbedding,
        jobEmbeddings
    };
}
