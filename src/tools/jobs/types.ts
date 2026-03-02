// JSearch API Response Types
export interface JSearchResponse {
    status: string;
    request_id: string;
    parameters: {
        query: string;
        page: number;
        num_pages: number;
        date_posted: string;
        country: string;
        language: string;
    };
    data: JSearchJob[];
}

export interface JSearchJob {
    job_title: string;
    employer_name: string;
    employer_logo: string;
    employer_website: string;
    job_employment_type: string;
    job_description: string;
    job_apply_link: string;
    job_location: string;
    job_salary_string: string;
    qualifications?: string[];
    responsibilities?: string[];
}
