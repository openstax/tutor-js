/* eslint-disable */
export { };

interface TutorTestConfig {
    URL: string
    URL: string
    PORT: number
    DEBUG: boolean
}

declare global {
    const testConfig: TutorTestConfig
    interface Window { _MODELS: any; }

    namespace jest {
        interface Matchers<R> {
            toHaveRendered(match: string): R
        }
        interface Expect {
            snapshot<T>(reactEl: any): JestMatchers<T>
        }
    }
}
