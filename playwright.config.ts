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
  testDir: './tests/e2e',
  testMatch: /.*\.spec\.ts/,
  testIgnore: ['**/dist/**', '**/build/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: reporters,

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    locale: process.env.PLAYWRIGHT_LOCALE ?? 'en',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
