import { PlaywrightTestConfig, expect } from '@playwright/test'
import { matchers } from 'expect-playwright'
expect.extend(matchers)

const config: PlaywrightTestConfig = {
    testDir: '../tutor/specs/e2e',
    testMatch: '*.e2e.ts',
    timeout: 1200000,
    workers: 2,
    forbidOnly: !!process.env.CI,
    globalSetup: '../tutor/specs/e2e/setup.ts',
    use: {
        actionTimeout: 20000,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
}

export default config;
