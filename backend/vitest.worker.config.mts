import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		include: ['test/worker/**/*.test.ts', 'test/worker/**/*.spec.ts'],
		setupFiles: ['./test/helpers/vitest-worker-banner.ts'],
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.jsonc', environment: 'test' },
			},
		},
	},
});
