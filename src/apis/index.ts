import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import express from "express";
import cors from "cors";
import { config, validateEnv } from "../config/env";

// Validate environment variables after loading
validateEnv();

import { StateManager } from "./services/stateManager";
import { createResumeRoutes } from "./routes/resume";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Initialize state manager
const stateManager = new StateManager();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));

app.use(express.json());
app.use(requestLogger);

// Health check endpoint
app.get("/health", (_req, res) => {
    res.json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv
    });
});

// Routes
app.use("/api/resume", createResumeRoutes(stateManager));

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    stateManager.cleanup();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});