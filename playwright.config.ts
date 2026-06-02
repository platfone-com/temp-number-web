import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, 'tests/.env') })
const reporters: [string, Record<string, unknown>][] = [
  ['html', { open: process.env.PW_NO_REPORT ? 'never' : 'on-failure' }]
]

if (process.env.PW_JUINT_ENABLED === '1') {
  reporters.push(['junit', { outputFile: 'test-results/junit.xml' }])
}

export default defineConfig({
  testMatch: /.*\.spec\.ts/,
  testIgnore: ['**/dist/**', '**/build/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: reporters,

  use: {
    locale: process.env.PLAYWRIGHT_LOCALE ?? 'en',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'e2e-whitelabel-manual',
      testDir: './tests/e2e/e2e-whitelabel-manual',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.PLAYWRIGHT_WL_BASE_URL
      }
    },
    {
      name: 'e2e-sms-manual',
      testDir: './tests/e2e/e2e-sms-manual',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.PLAYWRIGHT_SMS_BASE_URL
      }
    },
    {
      name: 'chromium',
      testDir: './tests/e2e/e2e-sms-manual',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.PLAYWRIGHT_BASE_URL
      }
    }
  ]
})
