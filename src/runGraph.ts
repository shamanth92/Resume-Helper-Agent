import { graph } from "./stateGraph";
import { Command } from "@langchain/langgraph";
import * as readline from 'readline';

async function getUserInput(prompt: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

export const runGraph = async (initialState: {
    resume: string;
    job: string;
    jobType: string;
    jobLocation: string;
}) => {
    const threadId = `resume-helper-${Date.now()}`;
    const config = {
        configurable: { thread_id: threadId }
    };

    console.log('\n' + '='.repeat(60));
    console.log(' RESUME HELPER AGENT');
    console.log('='.repeat(60));
    console.log(`\nJob: ${initialState.job}`);
    console.log(`Type: ${initialState.jobType}`);
    console.log(`Location: ${initialState.jobLocation}`);
    console.log(`Thread ID: ${threadId}\n`);

    try {
        // Phase 1: Initial invoke - runs until interrupt() is called
        console.log(' Processing resume and searching for jobs...\n');
        
        const result = await graph.invoke(initialState, config) as any;

        // Check if we hit an interrupt using __interrupt__ property
        if (result.__interrupt__) {
            const interruptData = result.__interrupt__[0];
            
            console.log('\n' + '='.repeat(60));
            console.log('  ' + interruptData.value.message);
            console.log('='.repeat(60) + '\n');

            // Display job options
            interruptData.value.options?.forEach((option: any) => {
                const job = result.rankedJobs?.[option.value - 1];  // Convert to 0-based for array access
                if (job) {
                    console.log(`[${option.value}] ${option.label}`);
                    console.log(`    ${job.employer_name} - ${job.job_location}`);
                    console.log(`    Match: ${((job.similarity || 0) * 100).toFixed(1)}% | Salary: ${job.job_salary_string || 'N/A'}\n`);
                }
            });

            // Get user selection
            const userInput = await getUserInput('Enter your selection: ');
            const selection = parseInt(userInput.trim());

            // Validate selection (1-based indexing)
            if (isNaN(selection) || selection < 1 || selection > (result.rankedJobs?.length || 0)) {
                console.log('\n Invalid selection');
                return null;
            }

            const selectedJob = result.rankedJobs[selection - 1];  // Convert to 0-based for array access
            console.log(`\n Selected: ${selectedJob.job_title} at ${selectedJob.employer_name}\n`);

            // Phase 2: Resume with Command({ resume: value })
            // The value passed here becomes the return value of interrupt() in the node
            console.log(' Continuing workflow...\n');
            
            const finalResult = await graph.invoke(
                new Command({ resume: selection }),
                config  // Must use same thread_id
            );

            console.log('\n' + '='.repeat(60));
            console.log(' WORKFLOW COMPLETED');
            console.log('='.repeat(60));

            return finalResult;
        }

        console.log('\n No interrupt detected');
        return result;

    } catch (error) {
        console.error('\n Error:', error);
        throw error;
    }
}