export { };

interface TutorTestConfig {
    URL: string
    DEBUG: boolean
}

declare global {
    const testConfig: TutorTestConfig
    interface Window { _MODELS: any; }
}
