import { graph } from "../stateGraph";

async function testPhase1() {
    const result = await graph.invoke({
         resume: "John Doe\nSoftware Engineer\n...",
        job: "Software Engineer",
        jobType: "Full-time",
        jobLocation: "Remote",
    });
    
    console.log('Final State: ', result);
}

testPhase1();