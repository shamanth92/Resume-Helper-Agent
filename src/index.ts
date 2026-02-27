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
        job: 'Senior Frontend Engineer',
        jobType: 'Full-time',
        jobLocation: 'California'
    });

    if (result) {
        console.log('\n📊 Final Result:');
        console.log('Selected Job:', result.selectedJob?.job_title);
        console.log('Company:', result.selectedJob?.employer_name);
        // console.log('Gap Analysis:', result.gapAnalysis);
        // console.log('Tailored Resume:', result.tailoredResume);
    }
}

main().catch(console.error);