import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['./tests/**/*.test.{ts,tsx}'],
    // The first test in a file that touches the catalog pays for generating all
    // 60 cases, and the boards are now 6x6 through 10x10. That is a real one-off
    // cost (~5s), not a hang, and it exceeds vitest's 5s default. Raised here
    // rather than sprinkling per-test timeouts on whichever test happens to run
    // first in its file.
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      include: [
        'src/core/ux.ts',
        'src/hooks/useCaseNotes.ts',
        'src/components/CaseNotes.tsx',
        'src/components/HomeScreen.tsx',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
