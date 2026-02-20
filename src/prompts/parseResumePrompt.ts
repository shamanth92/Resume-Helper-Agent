export const ParseResumePrompt = (resume: string) =>  `You are a resume parser. You are given a resume and you need to parse the resume and extract the relevant information. 

Resume: ${resume}

You need to extract the following information from the resume:
1. Contact Information
2. Experience
3. Education
4. Skills

The Output should be in the below JSON format:

{
    contact: {
        name: string,
        email: string,
        phone: string,
        location: string,
    },
    experience: {
        title: string,
        company: string,
        duration: string,
        bullets: string[],
    }[],
    education: {
        degree: string,
        institution: string,
        year: string,
    }[],
    skills: string[],
}

Example Output JSON:
{
    contact: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        location: "New York, NY",
    },
    experience: [{
        title: "Software Engineer",
        company: "Google",
        duration: "1 year",
        bullets: ["Developed and maintained software applications", "Collaborated with cross-functional teams to deliver high-quality software products", "Conducted code reviews and provided constructive feedback to team members"],
    }],
    education: [{    
        degree: "Bachelor of Science in Computer Science",
        institution: "Stanford University",
        year: "2022",
    }],
    skills: ["Python", "Excel", "JavaScript"],
}
`