import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('API Routes', () => {
	it('GET /health returns ok status', async () => {
		const request = new IncomingRequest('http://example.com/health');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const json = (await response.json()) as any;
		expect(json.status).toBe('ok');
	});

	it('POST /contact accepts valid form data', async () => {
		const request = new IncomingRequest('http://example.com/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: 'Test User',
				email: 'test@example.com',
				message: 'This is a test message with enough characters',
			}),
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(201);
		const json = (await response.json()) as any;
		expect(json.success).toBe(true);
	});

	it('POST /contact rejects message too short', async () => {
		const request = new IncomingRequest('http://example.com/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: 'Test',
				email: 'test@example.com',
				message: 'short',
			}),
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(400);
		const json = (await response.json()) as any;
		expect(json.error).toBeDefined();
	});

	it('GET /admin/messages returns 401 without auth', async () => {
		const request = new IncomingRequest('http://example.com/admin/messages');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(401);
		const json = (await response.json()) as any;
		expect(json.error).toContain('Authorization');
	});

	it('404 for unknown routes', async () => {
		const request = new IncomingRequest('http://example.com/unknown');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(404);
	});
});
