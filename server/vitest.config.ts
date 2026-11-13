import { existsSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

// Local runs read .env; in CI the variables come from the workflow
if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

export default defineConfig({});
