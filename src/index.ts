import { runGraph } from './runGraph';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    // Load resume from file
    const resumePath = path.join(process.cwd(), 'src','tests','sample-resumes', 'sample-resume-2.txt');
    const resumeText = fs.readFileSync(resumePath, 'utf-8');

    // Run the graph
    const result: any = await runGraph({
        resume: resumeText,
        job: 'Senior Front End Developer',
        jobType: 'Full-time',
        jobLocation: 'USA'
    });

    if (result) {
        console.log('\n📊 Final Result:');
        console.log('Selected Job:', result.selectedJob?.job_title);
        console.log('Company:', result.selectedJob?.employer_name);
    }
}

main().catch(console.error);