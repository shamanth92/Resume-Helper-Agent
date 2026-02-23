import { searchJobsNode } from '../nodes/searchJobsNode';
import { AgentState } from '../state';

async function testSearchJobs() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 JOB SEARCH TEST - Phase 3, Task 5');
    console.log('='.repeat(60));
    
    try {
        // Create dummy state with job query
        const dummyState: typeof AgentState.State = {
            resume: '',
            resumeData: undefined,
            job: 'Software Engineer',
            jobType: 'Full-time',
            jobLocation: 'Chicago',
            jobResults: undefined,
            selectedJob: undefined,
            tailoredResume: undefined,
            gapAnalysis: undefined,
            outputPath: undefined,
        };
        
        console.log('\n📋 Search Parameters:');
        console.log(`  Job Title: ${dummyState.job}`);
        console.log(`  Job Type: ${dummyState.jobType}`);
        console.log(`  Location: ${dummyState.jobLocation}`);
        console.log(`  Query: "${dummyState.jobType} ${dummyState.job} jobs in ${dummyState.jobLocation}"`);
        
        console.log('\n🔍 Calling searchJobsNode...\n');
        
        // Call searchJobsNode
        const result = await searchJobsNode(dummyState);
        
        // Verify data structure
        if (result.jobResults && Array.isArray(result.jobResults)) {
            console.log('\n✅ Jobs retrieved successfully!');
            console.log('\n📊 Results Summary:');
            console.log(`  Total jobs found: ${result.jobResults.length || 0}`);
            
            if (result.jobResults.length > 0) {
                console.log('\n📝 Sample Jobs (First 3):');
                console.log('='.repeat(60));
                
                const samplesToShow = Math.min(3, result.jobResults.length);
                for (let i = 0; i < samplesToShow; i++) {
                    const job = result.jobResults[i];
                    console.log(`\n[${i + 1}] ${job?.job_title || 'N/A'}`);
                    console.log(`    Company: ${job?.employer_name || 'N/A'}`);
                    console.log(`    Location: ${job?.job_location || 'N/A'}`);
                    console.log(`    Employment Type: ${job?.job_employment_type || 'N/A'}`);
                    console.log(`    Salary: ${job?.job_salary_string || 'Not specified'}`);
                    console.log(`    Apply URL: ${job?.job_apply_link || 'N/A'}`);
                    console.log(`    Company Website: ${job?.employer_website || 'N/A'}`);
                    if (job?.job_description) {
                        const shortDesc = job.job_description.substring(0, 100);
                        console.log(`    Description: ${shortDesc}${job.job_description.length > 100 ? '...' : ''}`);
                    }
                }
                
                // Verify data structure
                console.log('\n🔍 Data Structure Validation:');
                const firstJob = result.jobResults[0];
                console.log(`  ✓ Has job_title: ${!!firstJob?.job_title}`);
                console.log(`  ✓ Has employer_name: ${!!firstJob?.employer_name}`);
                console.log(`  ✓ Has employer_logo: ${!!firstJob?.employer_logo}`);
                console.log(`  ✓ Has employer_website: ${!!firstJob?.employer_website}`);
                console.log(`  ✓ Has job_employment_type: ${!!firstJob?.job_employment_type}`);
                console.log(`  ✓ Has job_description: ${!!firstJob?.job_description}`);
                console.log(`  ✓ Has job_apply_link: ${!!firstJob?.job_apply_link}`);
                console.log(`  ✓ Has job_location: ${!!firstJob?.job_location}`);
                console.log(`  ✓ Has job_salary_string: ${!!firstJob?.job_salary_string}`);
                console.log(`  ✓ Has qualifications: ${!!firstJob?.qualifications}`);
                console.log(`  ✓ Has responsibilities: ${!!firstJob?.responsibilities}`);
                
                // Full data dump for verification
                console.log('\n📄 Full First Job Data:');
                console.log(JSON.stringify(result.jobResults[0], null, 2));
                
            } else {
                console.log('\n⚠️  No jobs found for the given query');
            }
            
            console.log('\n' + '='.repeat(60));
            console.log('✅ Test completed successfully!');
            process.exit(0);
            
        } else {
            console.log('\n❌ Test failed: No jobs data returned');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('\n❌ Test failed with error:');
        console.error(error);
        process.exit(1);
    }
}

// Run test
testSearchJobs();
