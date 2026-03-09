import { Router } from "express";
import { resumeGraph, runGraph } from "../../agent/runner";
import { StateManager } from "../services/stateManager";

const router = Router();

export const createResumeRoutes = (stateManager: StateManager) => {
    router.post("/startAgent", async (req, res) => {
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

            await stateManager.setState(threadId, {
                status: "running",
                data: {},
                startedAt: new Date(),
                updatedAt: new Date()
            });

            // Start graph execution in background
            runGraph({
                resume: resumeText,
                job,
                jobType,
                jobLocation,
                threadId,
                stateManager
            }).catch(async (error) => {
                console.error(`❌ Error in thread ${threadId}:`, error);
                // Update state to failed so polling endpoint can retrieve error
                const currentState = await stateManager.getState(threadId);
                if (currentState) {
                    await stateManager.setState(threadId, {
                        ...currentState,
                        status: "failed",
                        error: error instanceof Error ? error.message : "Unknown error",
                        updatedAt: new Date()
                    });
                }
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
    });

    router.get("/getAgentStatus", async (req, res) => {
        const { threadId } = req.query;
        if (!threadId) {
            return res.status(400).json({
                error: "Missing threadId"
            });
        }
        
        const state = await stateManager.getState(threadId as string);
        if (!state) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }
        
        res.json(state);
    });

    router.post("/selectJob", async (req, res) => {
        const { threadId, selectedJobIndex } = req.body;
        if (!threadId || !selectedJobIndex) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        resumeGraph(threadId, selectedJobIndex, stateManager)
            .catch(async (error) => {
                console.error(`❌ Error resuming thread ${threadId}:`, error);
                // Update state to failed
                const currentState = await stateManager.getState(threadId);
                if (currentState) {
                    await stateManager.setState(threadId, {
                        ...currentState,
                        status: "failed",
                        error: error instanceof Error ? error.message : "Unknown error",
                        updatedAt: new Date()
                    });
                }
            });

        return res.status(202).json({
            message: "Agent started successfully"
        });
    });

    return router;
};
