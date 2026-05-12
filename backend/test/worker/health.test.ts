import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('GET /health', () => {
	it('returns ok status', async () => {
		const request = new IncomingRequest('http://example.com/health');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const json = (await response.json()) as any;
		expect(json.status).toBe('ok');
		expect(json.timestamp).toBeDefined();
	});
});
