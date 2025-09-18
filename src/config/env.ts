/**
 * Environment configuration
 * Centralizes all environment variable access with type safety
 */

interface EnvConfig {
    API_BASE_URL: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
}

export const env: EnvConfig = {
    API_BASE_URL: getEnvVar('API_BASE_URL', 'https://assessment.rooftop.my'),
} as const;

// Export individual values for convenience
export const { API_BASE_URL } = env;
