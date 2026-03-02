import { analyzeGapNode } from '../../nodes/analyzeGapsNode';

async function testAnalyzeGap() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TESTING GAP ANALYSIS NODE');
    console.log('='.repeat(60));

    try {
        // Mock resume data (parsed resume structure)
        const mockResumeData = {
            contact: {
                name: "John Doe",
                email: "john.doe@email.com",
                phone: "(555) 123-4567",
                location: "San Francisco, CA"
            },
            experience: [
                {
                    title: "Senior Software Engineer",
                    company: "Google Inc.",
                    duration: "January 2020 - Present",
                    bullets: [
                        "Led development of scalable microservices architecture serving 10M+ users",
                        "Implemented CI/CD pipelines reducing deployment time by 60%",
                        "Mentored team of 5 junior engineers on best practices"
                    ]
                },
                {
                    title: "Software Engineer",
                    company: "Facebook",
                    duration: "June 2017 - December 2019",
                    bullets: [
                        "Built real-time data processing systems using Python and Apache Kafka",
                        "Developed RESTful APIs consumed by mobile and web applications"
                    ]
                }
            ],
            education: [
                {
                    degree: "Bachelor of Science in Computer Science",
                    institution: "Stanford University",
                    year: "2017"
                }
            ],
            skills: ["Python", "JavaScript", "TypeScript", "React", "Node.js", "Docker", "Kubernetes", "AWS"]
        };

        // Mock selected job
        const mockSelectedJob = {
            job_title: "Senior Full Stack Engineer",
            employer_name: "Tech Startup Inc.",
            employer_logo: "https://example.com/logo.png",
            employer_website: "https://techstartup.com",
            job_employment_type: "Full-time",
            job_description: `We are seeking a Senior Full Stack Engineer to join our growing team.

Requirements:
- 5+ years of experience in full-stack development
- Strong proficiency in React, Node.js, and TypeScript
- Experience with cloud platforms (AWS, Azure, or GCP)
- Knowledge of GraphQL and REST APIs
- Experience with microservices architecture
- Familiarity with CI/CD pipelines
- Strong understanding of database design (SQL and NoSQL)
- Experience with containerization (Docker, Kubernetes)
- Knowledge of modern DevOps practices
- Experience with testing frameworks (Jest, Mocha, Cypress)

Nice to have:
- Experience with Next.js or similar frameworks
- Knowledge of GraphQL
- Experience with serverless architecture
- Familiarity with Terraform or similar IaC tools`,
            job_apply_link: "https://techstartup.com/careers/apply",
            qualifications: [
                "5+ years full-stack development",
                "React, Node.js, TypeScript",
                "AWS or similar cloud platform",
                "Microservices architecture",
                "CI/CD experience"
            ],
            responsibilities: [
                "Design and implement scalable web applications",
                "Collaborate with product team on feature development",
                "Mentor junior developers",
                "Participate in code reviews and architectural decisions"
            ],
            job_location: "San Francisco, CA (Hybrid)",
            job_salary_string: "$150,000 - $200,000"
        };

        // Create mock state
        const mockState = {
            resume: "mock resume text",
            resumeData: mockResumeData,
            job: "Senior Full Stack Engineer",
            jobType: "Full-time",
            jobLocation: "San Francisco, CA",
            selectedJob: mockSelectedJob
        };

        console.log('\n📋 Test Input:');
        console.log(`  Resume: ${mockResumeData.contact.name}`);
        console.log(`  Skills: ${mockResumeData.skills.slice(0, 5).join(', ')}...`);
        console.log(`  Job: ${mockSelectedJob.job_title} at ${mockSelectedJob.employer_name}`);

        console.log('\n⏳ Calling analyzeGapNode...\n');

        // Call the node
        const result = await analyzeGapNode(mockState as any);

        console.log('\n' + '='.repeat(60));
        console.log('✅ GAP ANALYSIS COMPLETED');
        console.log('='.repeat(60));

        if (result.gapAnalysis) {
            console.log('\n📊 Gap Analysis Results:');
            
            console.log('\n✓ Matching Skills:');
            if (result.gapAnalysis.matchingSkills && result.gapAnalysis.matchingSkills.length > 0) {
                result.gapAnalysis.matchingSkills.forEach(skill => {
                    console.log(`  • ${skill}`);
                });
            } else {
                console.log('  (none found)');
            }

            console.log('\n✗ Missing Skills:');
            if (result.gapAnalysis.missingSkills && result.gapAnalysis.missingSkills.length > 0) {
                result.gapAnalysis.missingSkills.forEach(skill => {
                    console.log(`  • ${skill}`);
                });
            } else {
                console.log('  (none found)');
            }

            console.log('\n🔑 Keywords to Add:');
            if (result.gapAnalysis.keywordsToAdd && result.gapAnalysis.keywordsToAdd.length > 0) {
                result.gapAnalysis.keywordsToAdd.forEach(keyword => {
                    console.log(`  • ${keyword}`);
                });
            } else {
                console.log('  (none found)');
            }

            console.log('\n📝 Experience Alignment:');
            console.log(`  ${result.gapAnalysis.experienceAlignment || 'No alignment analysis provided'}`);

            // Validation
            console.log('\n' + '='.repeat(60));
            console.log('🔍 VALIDATION');
            console.log('='.repeat(60));

            const hasMatchingSkills = result.gapAnalysis.matchingSkills && result.gapAnalysis.matchingSkills.length > 0;
            const hasMissingSkills = result.gapAnalysis.missingSkills && result.gapAnalysis.missingSkills.length > 0;
            const hasKeywords = result.gapAnalysis.keywordsToAdd && result.gapAnalysis.keywordsToAdd.length > 0;
            const hasAlignment = result.gapAnalysis.experienceAlignment && result.gapAnalysis.experienceAlignment.length > 0;

            console.log(`\n  Matching Skills: ${hasMatchingSkills ? '✓' : '✗'}`);
            console.log(`  Missing Skills: ${hasMissingSkills ? '✓' : '✗'}`);
            console.log(`  Keywords to Add: ${hasKeywords ? '✓' : '✗'}`);
            console.log(`  Experience Alignment: ${hasAlignment ? '✓' : '✗'}`);

            if (hasMatchingSkills && hasAlignment) {
                console.log('\n✅ Test PASSED: Gap analysis completed successfully!');
            } else {
                console.log('\n⚠️  Test PARTIAL: Some fields may be missing or empty.');
            }
        } else {
            console.log('\n❌ No gap analysis data returned');
        }

    } catch (error) {
        console.error('\n❌ Test failed with error:');
        console.error(error);
        process.exit(1);
    }
}

// Run test
testAnalyzeGap();
