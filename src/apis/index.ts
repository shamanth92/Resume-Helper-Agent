import express from "express";
import { resumeGraph, runGraph } from "../agent/runner";
import { ExecutionState } from "./agentTypes";

const app = express();
const PORT = 3000;

app.use(express.json());

const executionStates = new Map<string, ExecutionState>();

app.post("/api/resume/startAgent", (req, res) => {
    try {
        const { resumeText, job, jobType, jobLocation } = req.body;

        // Validate required fields
        if (!resumeText || !job || !jobType || !jobLocation) {
            return res.status(400).json({
                error: "Missing required fields",
                required: ["resumeText", "job", "jobType", "jobLocation"]
            });
        }

        const threadId = `resume-helper-${Date.now()}`;

        executionStates.set(threadId, {
            status: "running",
            data: {},
            startedAt: new Date(),
            updatedAt: new Date()
        })

        // Start graph execution in background
        runGraph({
            resume: resumeText,
            job,
            jobType,
            jobLocation,
            threadId,
            executionStates
        }).catch(error => {
            console.error(`❌ Error in thread ${threadId}:`, error);
            // TODO: Store error state for polling endpoint to retrieve
        });

        res.status(202).json({
            threadId,
            message: "Agent started successfully"
        });
    } catch (error) {
        console.error("Error starting agent:", error);
        res.status(500).json({
            error: "Failed to start agent",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
    return null
});

app.get("/api/resume/getAgentStatus", (req, res) => {
    const { threadId } = req.query;
    if (!threadId) {
        return res.status(400).json({
            error: "Missing threadId"
        })
    }
    const state = executionStates.get(threadId as string)
    if (!state) {
        return res.status(404).json({
            error: "Thread not found"
        })
    }
    res.json(state);
    return null
})

app.post("/api/resume/selectJob", (req, res) => {
    const { threadId, selectedJobIndex } = req.body;
    if (!threadId || !selectedJobIndex) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    resumeGraph(threadId, selectedJobIndex, executionStates)
        .catch(error => {
            console.error(`❌ Error resuming thread ${threadId}:`, error);
        });

    return res.status(202).json({
        message: "Agent started successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});