/* eslint-disable */
export { };

interface TutorTestConfig {
    URL: string
    API_URL: string
    DEBUG: boolean
    frontendPort: number
    backendPort: number
}

declare global {
    const testConfig: TutorTestConfig
    interface Window { _MODELS: any; }
}
