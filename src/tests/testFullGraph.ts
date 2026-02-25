import { graph } from '../stateGraph';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

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

async function testFullGraph() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 FULL GRAPH EXECUTION TEST');
    console.log('='.repeat(60));
    console.log('\nThis test runs the complete graph workflow with real interrupts.');
    
    try {
        const threadId = `full-graph-test-${Date.now()}`;
        const config = {
            configurable: { thread_id: threadId }
        };
        
        // Read sample resume
        const resumePath = path.join(process.cwd(), 'sample-resumes', 'sample-resume-2.txt');
        let resumeText = '';
        
        if (fs.existsSync(resumePath)) {
            resumeText = fs.readFileSync(resumePath, 'utf-8');
            console.log(`\n✅ Loaded resume from: ${resumePath}`);
        } else {
            console.log('\n⚠️  Sample resume not found, using default resume text');
            resumeText = `John Doe
Senior Software Engineer
john.doe@email.com | (555) 123-4567 | San Francisco, CA

EXPERIENCE
Senior Software Engineer at Google Inc.
January 2020 - Present
- Led development of scalable microservices architecture serving 10M+ users
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored team of 5 junior engineers on best practices

Software Engineer at Facebook
June 2017 - December 2019
- Built real-time data processing systems using Python and Apache Kafka
- Developed RESTful APIs consumed by mobile and web applications

EDUCATION
Bachelor of Science in Computer Science
Stanford University, 2017

SKILLS
Python, JavaScript, TypeScript, React, Node.js, Docker, Kubernetes, AWS`;
        }
        
        // Get job search parameters from user
        console.log('\n📋 Job Search Configuration:');
        const jobTitle = await getUserInput('Enter job title (default: Software Engineer): ') || 'Software Engineer';
        const jobType = await getUserInput('Enter job type (default: Full-time): ') || 'Full-time';
        const jobLocation = await getUserInput('Enter location (default: San Francisco): ') || 'San Francisco';
        
        const initialState = {
            resume: resumeText,
            job: jobTitle,
            jobType: jobType,
            jobLocation: jobLocation,
        };
        
        console.log('\n📊 Starting Graph Execution:');
        console.log(`  Job: ${jobTitle}`);
        console.log(`  Type: ${jobType}`);
        console.log(`  Location: ${jobLocation}`);
        console.log(`  Thread ID: ${threadId}`);
        
        console.log('\n🚀 Phase 1: Resume Parsing & Job Search');
        console.log('⏳ Processing: parseResume → searchJobs → rankJobs → selectJob\n');
        
        // Stream the graph execution
        for await (const chunk of await graph.stream(initialState, {
            ...config,
            streamMode: "updates"
        })) {
            const nodeName = Object.keys(chunk)[0];
            console.log(`✓ Completed: ${nodeName}`);
            
            // Show some details for key nodes
            if (nodeName === 'parseResume' && chunk[nodeName]?.resumeData) {
                console.log(`  → Parsed resume for: ${chunk[nodeName]?.resumeData?.contact?.name}`);
            }
            if (nodeName === 'searchJobs' && chunk[nodeName]?.jobResults) {
                console.log(`  → Found ${chunk[nodeName]?.jobResults?.length} jobs`);
            }
            if (nodeName === 'rankJobs' && chunk[nodeName]?.rankedJobs) {
                console.log(`  → Ranked top ${chunk[nodeName]?.rankedJobs?.length} jobs`);
            }
        }
        
        // Check for interrupt
        const stateSnapshot = await graph.getState(config);
        
        if (stateSnapshot.tasks && stateSnapshot.tasks.length > 0) {
            const task = stateSnapshot.tasks[0];
            if (task.interrupts && task.interrupts.length > 0) {
                const interrupt = task.interrupts[0];
                
                console.log('\n' + '='.repeat(60));
                console.log('⏸️  INTERRUPT: Job Selection Required');
                console.log('='.repeat(60));
                console.log(`\n${interrupt.value.message}\n`);
                console.log('Available Jobs:');
                
                interrupt.value.options?.forEach((option: any) => {
                    const job = stateSnapshot.values.rankedJobs?.[option.value];
                    if (job) {
                        console.log(`\n[${option.value}] ${option.label}`);
                        console.log(`    Company: ${job.employer_name}`);
                        console.log(`    Location: ${job.job_location}`);
                        console.log(`    Similarity: ${((job.similarity || 0) * 100).toFixed(2)}%`);
                        console.log(`    Salary: ${job.job_salary_string || 'Not specified'}`);
                    }
                });
                
                // Get user selection
                const userInput = await getUserInput('\n👤 Enter your selection (number): ');
                const selection = parseInt(userInput.trim());
                
                const selectedJob = stateSnapshot.values.rankedJobs?.[selection];
                if (!selectedJob) {
                    console.log('\n❌ Invalid selection');
                    process.exit(1);
                }
                
                console.log(`\n✅ Selected: ${selectedJob.job_title} at ${selectedJob.employer_name}`);
                
                // Update state with selection
                await graph.updateState(config, { selectedJob });
                
                console.log('\n' + '='.repeat(60));
                console.log('✅ INTERRUPT TEST COMPLETED');
                console.log('='.repeat(60));
                
                console.log('\n📊 Final Results:');
                console.log(`  Resume Parsed: ✓`);
                console.log(`  Jobs Found: ✓`);
                console.log(`  Jobs Ranked: ✓`);
                console.log(`  Job Selected: ${selectedJob.job_title} at ${selectedJob.employer_name}`);
                
                console.log('\n📝 Note: Gap analysis, resume tailoring, and document generation');
                console.log('   nodes are not yet implemented and will be added in future phases.');
                
                console.log('\n✅ Test completed successfully!');
                process.exit(0);
            }
        }
        
        console.log('\n⚠️  No interrupt detected. Graph may have completed without pausing.');
        console.log('This could mean the selectJob node did not trigger an interrupt.');
        process.exit(1);
        
    } catch (error) {
        console.error('\n❌ Test failed with error:');
        console.error(error);
        process.exit(1);
    }
}

// Run test
testFullGraph();
