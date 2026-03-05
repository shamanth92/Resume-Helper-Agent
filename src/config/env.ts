export const validateEnv = () => {
    const required = ['OPENAI_API_KEY', 'JSEARCH_API_KEY', 'JSEARCH_API_HOST'];
    const missing: string[] = [];
    
    required.forEach(key => {
        if (!process.env[key]) {
            missing.push(key);
        }
    });
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

export const config = {
    get port() {
        return parseInt(process.env.PORT || '3000');
    },
    get openaiApiKey() {
        return process.env.OPENAI_API_KEY;
    },
    get jsearchApiKey() {
        return process.env.JSEARCH_API_KEY;
    },
    get jsearchApiHost() {
        return process.env.JSEARCH_API_HOST;
    },
    get nodeEnv() {
        return process.env.NODE_ENV || 'development';
    }
};