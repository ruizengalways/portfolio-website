import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		include: ['test/unit/**/*.test.ts', 'test/integration/**/*.test.ts'],
		setupFiles: ['./test/helpers/vitest-node-banner.ts'],
	},
});
