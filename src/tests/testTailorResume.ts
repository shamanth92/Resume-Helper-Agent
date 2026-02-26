import { tailorResumeNode } from '../nodes/tailorResumeNode';

async function testTailorResume() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TESTING TAILOR RESUME NODE');
    console.log('='.repeat(60));

    try {
        // Mock resume data
        const mockResumeData = {
            contact: {
                name: "Jane Smith",
                email: "jane.smith@email.com",
                phone: "+1 555-123-4567",
                location: "San Francisco, CA"
            },
            experience: [
                {
                    title: "Senior Software Engineer",
                    company: "Tech Corp",
                    duration: "January 2020 - Present",
                    bullets: [
                        "Developed scalable web applications using React and Node.js serving 100K+ users",
                        "Implemented microservices architecture with Docker and Kubernetes",
                        "Led frontend team of 4 developers and conducted code reviews",
                        "Reduced page load time by 40% through performance optimization",
                        "Built CI/CD pipelines using GitHub Actions and AWS"
                    ]
                },
                {
                    title: "Frontend Developer",
                    company: "Startup Inc",
                    duration: "June 2017 - December 2019",
                    bullets: [
                        "Built responsive web applications using React and TypeScript",
                        "Integrated RESTful APIs and GraphQL endpoints",
                        "Implemented state management using Redux and Context API",
                        "Collaborated with UX designers to implement pixel-perfect designs"
                    ]
                }
            ],
            education: [
                {
                    degree: "Bachelor of Science in Computer Science",
                    institution: "State University",
                    year: "2017"
                }
            ],
            skills: [
                "JavaScript", "TypeScript", "React", "Next.js", "Vue.js",
                "Node.js", "GraphQL", "REST APIs", "Docker", "Kubernetes",
                "AWS", "Git", "Jest", "Redux", "HTML/CSS"
            ]
        };

        // Mock selected job
        const mockSelectedJob = {
            job_title: "Senior Frontend Engineer",
            employer_name: "Tech Startup Inc.",
            employer_logo: "https://example.com/logo.png",
            employer_website: "https://techstartup.com",
            job_employment_type: "Full-time",
            job_description: `We are seeking a Senior Frontend Engineer to join our growing team.

Requirements:
- 5+ years of experience in frontend development
- Expert-level proficiency in React and TypeScript
- Experience with modern frontend frameworks (Next.js, Vue, or Angular)
- Strong understanding of state management (Redux, Context API)
- Experience with GraphQL and REST APIs
- Knowledge of responsive design and CSS frameworks
- Experience with testing frameworks (Jest, React Testing Library)
- Familiarity with CI/CD pipelines and DevOps practices
- Strong communication and mentorship skills

Nice to have:
- Experience with micro-frontends
- Knowledge of Web Performance Optimization
- Experience with Design Systems
- Familiarity with Figma or similar design tools`,
            job_apply_link: "https://techstartup.com/careers/apply",
            qualifications: [
                "5+ years frontend development",
                "React, TypeScript expert",
                "Next.js or similar framework",
                "GraphQL experience",
                "Testing experience"
            ],
            responsibilities: [
                "Build and maintain scalable frontend applications",
                "Collaborate with designers and backend engineers",
                "Mentor junior developers",
                "Participate in code reviews and architectural decisions"
            ],
            job_location: "New York, NY (Hybrid)",
            job_salary_string: "$140,000 - $180,000"
        };

        // Mock gap analysis
        const mockGapAnalysis = {
            matchingSkills: [
                "React", "TypeScript", "Next.js", "GraphQL", "Node.js",
                "Jest", "Redux", "CI/CD", "Docker", "Kubernetes"
            ],
            missingSkills: [
                "Micro-frontends", "Web Performance Optimization",
                "Design Systems", "Figma"
            ],
            keywordsToAdd: [
                "Responsive Design", "State Management", "Component Architecture",
                "Frontend Performance", "Accessibility", "Cross-browser Compatibility"
            ],
            experienceAlignment: "The candidate has strong frontend experience with React, TypeScript, and Next.js. They have demonstrated leadership through mentoring and have worked with modern tools like GraphQL, Docker, and CI/CD. However, they should emphasize their frontend-specific achievements and UI/UX work more prominently."
        };

        // Create mock state
        const mockState = {
            resume: "mock resume text",
            resumeData: mockResumeData,
            job: "Senior Frontend Engineer",
            jobType: "Full-time",
            jobLocation: "New York, NY",
            selectedJob: mockSelectedJob,
            gapAnalysis: mockGapAnalysis
        };

        console.log('\n📋 Test Input:');
        console.log(`  Candidate: ${mockResumeData.contact.name}`);
        console.log(`  Current Skills: ${mockResumeData.skills.slice(0, 5).join(', ')}...`);
        console.log(`  Target Job: ${mockSelectedJob.job_title} at ${mockSelectedJob.employer_name}`);
        console.log(`  Matching Skills: ${mockGapAnalysis.matchingSkills.length}`);
        console.log(`  Missing Skills: ${mockGapAnalysis.missingSkills.length}`);

        console.log('\n⏳ Calling tailorResumeNode...\n');

        // Call the node
        const result = await tailorResumeNode(mockState as any);

        console.log('\n' + '='.repeat(60));
        console.log('✅ RESUME TAILORING COMPLETED');
        console.log('='.repeat(60));

        if (result.tailoredResume) {
            const tailored = result.tailoredResume;

            console.log('\n📝 Tailored Resume Summary:');
            if (tailored.summary) {
                console.log(`\n${tailored.summary}`);
            } else {
                console.log('\n(No summary generated)');
            }

            console.log('\n💼 Experience Entries:');
            if (tailored.experience && tailored.experience.length > 0) {
                tailored.experience.forEach((exp, idx) => {
                    console.log(`\n${idx + 1}. ${exp.title} at ${exp.company}`);
                    console.log(`   Duration: ${exp.duration}`);
                    console.log(`   Bullets: ${exp.bullets?.length || 0} items`);
                    if (exp.bullets && exp.bullets.length > 0) {
                        exp.bullets.slice(0, 2).forEach(bullet => {
                            console.log(`   • ${bullet}`);
                        });
                        if (exp.bullets.length > 2) {
                            console.log(`   ... and ${exp.bullets.length - 2} more`);
                        }
                    }
                });
            } else {
                console.log('  (No experience entries)');
            }

            console.log('\n🎓 Education:');
            if (tailored.education && tailored.education.length > 0) {
                tailored.education.forEach(edu => {
                    console.log(`  • ${edu.degree} - ${edu.institution}${edu.year ? ` (${edu.year})` : ''}`);
                });
            } else {
                console.log('  (No education entries)');
            }

            console.log('\n🔧 Skills:');
            if (tailored.skills && tailored.skills.length > 0) {
                console.log(`  ${tailored.skills.join(', ')}`);
            } else {
                console.log('  (No skills listed)');
            }

            // Validation
            console.log('\n' + '='.repeat(60));
            console.log('🔍 VALIDATION');
            console.log('='.repeat(60));

            const hasSummary = tailored.summary && tailored.summary.length > 0;
            const hasExperience = tailored.experience && tailored.experience.length > 0;
            const hasSkills = tailored.skills && tailored.skills.length > 0;
            const hasEducation = tailored.education && tailored.education.length > 0;

            console.log(`\n  Summary: ${hasSummary ? '✓' : '✗'}`);
            console.log(`  Experience: ${hasExperience ? '✓' : '✗'} (${tailored.experience?.length || 0} entries)`);
            console.log(`  Skills: ${hasSkills ? '✓' : '✗'} (${tailored.skills?.length || 0} skills)`);
            console.log(`  Education: ${hasEducation ? '✓' : '✗'} (${tailored.education?.length || 0} entries)`);

            // Check if tailored resume includes keywords from gap analysis
            const tailoredText = JSON.stringify(tailored).toLowerCase();
            const keywordsFound = mockGapAnalysis.keywordsToAdd.filter(keyword => 
                tailoredText.includes(keyword.toLowerCase())
            );

            console.log(`\n  Keywords Added: ${keywordsFound.length}/${mockGapAnalysis.keywordsToAdd.length}`);
            if (keywordsFound.length > 0) {
                console.log(`    Found: ${keywordsFound.join(', ')}`);
            }

            if (hasSummary && hasExperience && hasSkills && hasEducation) {
                console.log('\n✅ Test PASSED: Resume tailored successfully with all sections!');
            } else {
                console.log('\n⚠️  Test PARTIAL: Some sections may be missing or empty.');
            }

        } else {
            console.log('\n❌ No tailored resume data returned');
        }

    } catch (error) {
        console.error('\n❌ Test failed with error:');
        console.error(error);
        process.exit(1);
    }
}

// Run test
testTailorResume();
