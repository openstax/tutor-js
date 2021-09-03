import { PlaywrightTestConfig, expect } from '@playwright/test'
import { matchers } from 'expect-playwright'
expect.extend(matchers)

const config: PlaywrightTestConfig = {
    testDir: '../tutor/specs/e2e',
    testMatch: '*.e2e.ts',
    workers: 2,
    timeout: 10000,
    forbidOnly: !!process.env.CI,
    globalSetup: '../tutor/specs/e2e/setup.ts',
    use: {
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
}

export default config;
