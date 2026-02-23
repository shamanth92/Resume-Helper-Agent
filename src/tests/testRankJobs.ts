import { rankJobsNode } from '../nodes/rankJobsNode';
import { AgentState } from '../state';

async function testRankJobs() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 JOB RANKING TEST - Phase 4, Task 1');
    console.log('='.repeat(60));
    
    try {
        // Create dummy state with resume data and job results
        const dummyState: typeof AgentState.State = {
            resume: '',
            resumeData: {
                contact: {
                    name: "John Doe",
                    email: "john.doe@email.com",
                    phone: "(555) 123-4567",
                    location: "San Francisco, CA"
                },
                experience: [
                    {
                        title: "Senior Frontend Engineer",
                        company: "Google Inc.",
                        duration: "January 2020 - Present",
                        bullets: [
                            "Led development of scalable microservices architecture serving 10M+ users",
                            "Implemented CI/CD pipelines reducing deployment time by 60%",
                            "Mentored team of 5 junior engineers on best practices and code reviews"
                        ]
                    },
                    {
                        title: "Backend Engineer",
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
            },
            job: 'Software Engineer',
            jobType: 'Full-time',
            jobLocation: 'San Francisco',
            jobResults: [
                {
                    job_title: "Senior Backend Engineer",
                    employer_name: "Tech Startup Inc",
                    employer_logo: "https://example.com/logo1.png",
                    employer_website: "https://techstartup.com",
                    job_employment_type: "FULLTIME",
                    job_description: "We are looking for a Senior Backend Engineer with experience in Python, microservices, and cloud infrastructure. You will lead the development of scalable APIs and mentor junior developers.",
                    job_apply_link: "https://example.com/apply1",
                    job_location: "San Francisco, CA",
                    job_salary_string: "$150,000 - $180,000"
                },
                {
                    job_title: "Frontend Developer",
                    employer_name: "Design Agency",
                    employer_logo: "https://example.com/logo2.png",
                    employer_website: "https://designagency.com",
                    job_employment_type: "FULLTIME",
                    job_description: "Looking for a creative Frontend Developer skilled in React, CSS, and UI/UX design. Experience with design tools like Figma is a plus.",
                    job_apply_link: "https://example.com/apply2",
                    job_location: "San Francisco, CA",
                    job_salary_string: "$120,000 - $140,000"
                },
                {
                    job_title: "Frontend Engineer",
                    employer_name: "E-commerce Platform",
                    employer_logo: "https://example.com/logo3.png",
                    employer_website: "https://ecommerce.com",
                    job_employment_type: "FULLTIME",
                    job_description: "Join our team as a Frontend Engineer working with Node.js, React, and AWS. You'll build features for our growing e-commerce platform serving millions of users.",
                    job_apply_link: "https://example.com/apply3",
                    job_location: "San Francisco, CA",
                    job_salary_string: "$140,000 - $170,000"
                },
                {
                    job_title: "Data Scientist",
                    employer_name: "Analytics Corp",
                    employer_logo: "https://example.com/logo4.png",
                    employer_website: "https://analytics.com",
                    job_employment_type: "FULLTIME",
                    job_description: "We need a Data Scientist with strong Python and machine learning skills. Experience with TensorFlow and data visualization is required.",
                    job_apply_link: "https://example.com/apply4",
                    job_location: "San Francisco, CA",
                    job_salary_string: "$160,000 - $190,000"
                },
                {
                    job_title: "DevOps Engineer",
                    employer_name: "Cloud Solutions",
                    employer_logo: "https://example.com/logo5.png",
                    employer_website: "https://cloudsolutions.com",
                    job_employment_type: "FULLTIME",
                    job_description: "Seeking a DevOps Engineer experienced with Kubernetes, Docker, AWS, and CI/CD pipelines. You'll manage our cloud infrastructure and deployment processes.",
                    job_apply_link: "https://example.com/apply5",
                    job_location: "San Francisco, CA",
                    job_salary_string: "$145,000 - $175,000"
                }
            ],
            selectedJob: undefined,
            tailoredResume: undefined,
            gapAnalysis: undefined,
            outputPath: undefined,
        };
        
        console.log('\n📋 Test Data:');
        console.log(`  Total jobs to rank: ${dummyState.jobResults?.length || 0}`);
        
        console.log('\n🔍 Calling rankJobsNode...');
        console.log('⏳ Computing embeddings and similarity scores...\n');
        
        // Call rankJobsNode
        const result = await rankJobsNode(dummyState);

        console.log('Result:', result);
        
        // Verify results
        if (result.rankedJobs && Array.isArray(result.rankedJobs)) {
            console.log('\n✅ Jobs ranked successfully!');
            console.log('\n📊 Top 3 Ranked Jobs:');
            console.log('='.repeat(60));
            
            result.rankedJobs.forEach((job, index) => {
                console.log(`\n[${index + 1}] ${job.job_title} at ${job.employer_name}`);
                console.log(`    Similarity Score: ${(job.similarity * 100).toFixed(2)}%`);
                console.log(`    Location: ${job.job_location}`);
                console.log(`    Salary: ${job.job_salary_string}`);
                console.log(`    Description: ${job.job_description?.substring(0, 100) || 'N/A'}...`);
            });
            
            // Verify ranking order
            console.log('\n🔍 Validation:');
            console.log(`  ✓ Returned top 3 jobs: ${result.rankedJobs.length === 3}`);
            
            if (result.rankedJobs.length >= 2) {
                const isSorted = result.rankedJobs[0].similarity >= result.rankedJobs[1].similarity;
                console.log(`  ✓ Jobs sorted by similarity: ${isSorted}`);
            }
            
            const allHaveSimilarity = result.rankedJobs.every(job => typeof job.similarity === 'number');
            console.log(`  ✓ All jobs have similarity scores: ${allHaveSimilarity}`);
            
            console.log('\n' + '='.repeat(60));
            console.log('✅ Test completed successfully!');
            process.exit(0);
            
        } else {
            console.log('\n❌ Test failed: No ranked jobs returned');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('\n❌ Test failed with error:');
        console.error(error);
        process.exit(1);
    }
}

// Run test
testRankJobs();
