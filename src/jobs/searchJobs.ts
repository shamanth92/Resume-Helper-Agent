import axios from "axios";
import dotenv from "dotenv";
import { JSearchResponse } from "./types";

// Load environment variables
dotenv.config();

export const searchJobs = async (jobQuery: string): Promise<JSearchResponse> => {
    console.log("Searching for jobs...");
    const response = await axios.get<JSearchResponse>(`https://jsearch.p.rapidapi.com/search?query=${jobQuery}&page=1&num_pages=1&country=us&date_posted=all`, {
        headers: {
            'x-rapidapi-key': process.env.JSEARCH_API_KEY,
            'x-rapidapi-host': process.env.JSEARCH_API_HOST
        }
    });
    return response.data;
};
