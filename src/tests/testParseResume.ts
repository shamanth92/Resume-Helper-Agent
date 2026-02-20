import { readFileSync } from 'fs';
import { parseResumeNode } from '../nodes/parseResumeNode';
import { AgentState } from '../state';

async function testSingleResume(filePath: string, testName: string) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${testName}`);
    console.log('='.repeat(60));
    
    try {
        // Read sample resume from file
        const resumeText = readFileSync(filePath, 'utf-8');
        console.log(`✓ Resume loaded from ${filePath}`);
        console.log(`  Length: ${resumeText.length} characters\n`);
        
        // Create initial state
        const initialState: typeof AgentState.State = {
            resume: resumeText,
            job: '',
            jobType: '',
            jobLocation: '',
            resumeData: undefined,
            jobResults: undefined,
            selectedJob: undefined,
            tailoredResume: undefined,
            gapAnalysis: undefined,
            outputPath: undefined,
        };
        
        console.log('⏳ Parsing resume with LLM...');
        
        // Call parseResumeNode
        const result = await parseResumeNode(initialState);
        
        // Validate structure
        if (result.resumeData) {
            console.log('\n📊 Parsed Data Summary:');
            console.log('  ✓ Contact:', result.resumeData.contact?.name || 'N/A');
            console.log('  ✓ Email:', result.resumeData.contact?.email || 'N/A');
            console.log('  ✓ Phone:', result.resumeData.contact?.phone || 'N/A');
            console.log('  ✓ Location:', result.resumeData.contact?.location || 'N/A');
            console.log('  ✓ Experience entries:', result.resumeData.experience?.length || 0);
            console.log('  ✓ Education entries:', result.resumeData.education?.length || 0);
            console.log('  ✓ Skills count:', result.resumeData.skills?.length || 0);
            
            console.log('\n📝 Detailed Output:');
            console.log(JSON.stringify(result.resumeData, null, 2));
            
            console.log(`\n✅ ${testName} - PASSED`);
            return true;
        } else {
            console.log(`\n❌ ${testName} - FAILED: No data returned`);
            return false;
        }
        
    } catch (error) {
        console.error(`\n❌ ${testName} - FAILED:`, error);
        return false;
    }
}

async function testParseResume() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 RESUME PARSER TEST SUITE - Phase 2, Task 3');
    console.log('='.repeat(60));
    
    const tests = [
        { file: './src/tests/sample-resume.txt', name: 'Standard Format Resume' },
        { file: './src/tests/sample-resume-2.txt', name: 'Alternative Format Resume' },
        { file: './src/tests/sample-resume-3.txt', name: 'Real Format Resume' },
    ];
    
    const results: boolean[] = [];
    
    for (const test of tests) {
        const passed = await testSingleResume(test.file, test.name);
        results.push(passed);
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total tests: ${results.length}`);
    console.log(`Passed: ${results.filter(r => r).length}`);
    console.log(`Failed: ${results.filter(r => !r).length}`);
    
    if (results.every(r => r)) {
        console.log('\n✅ All tests passed!');
        process.exit(0);
    } else {
        console.log('\n❌ Some tests failed!');
        process.exit(1);
    }
}

// Run test
testParseResume();
