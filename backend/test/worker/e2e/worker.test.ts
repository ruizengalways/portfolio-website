/**
 * End-to-End tests for the Cloudflare Worker.
 *
 * These tests exercise the full request pipeline:
 *   Request → router → middleware (CORS, rate-limit, auth, logger) → handler → Response
 *
 * The `env` binding from cloudflare:test provides in-memory KV for MESSAGES_KV
 * and RATE_LIMIT_KV. ADMIN_API_KEY is loaded from .dev.vars ("test-key-local-123").
 */
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../../../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;
const BASE = 'http://example.com';

// The value set in .dev.vars for local/test environments
const ADMIN_KEY = 'test-key-local-123';
let rateLimitIpCounter = 1;

function createUniqueRateLimitIp(): string {
	const runId = Date.now() % 250;
	const testId = rateLimitIpCounter++ % 250;
	return `10.0.${runId}.${testId}`;
}

async function fetch(path: string, init?: RequestInit): Promise<Response> {
	const req = new IncomingRequest(`${BASE}${path}`, init as RequestInit<IncomingRequestCfProperties<unknown>>);
	const ctx = createExecutionContext();
	const res = await worker.fetch(req, env, ctx);
	await waitOnExecutionContext(ctx);
	return res;
}

// ── GET /health ───────────────────────────────────────────────────────────────

describe('E2E – GET /health', () => {
	it('returns 200', async () => {
		const res = await fetch('/health');
		expect(res.status).toBe(200);
	});

	it("returns status:'ok'", async () => {
		const res = await fetch('/health');
		const body = (await res.json()) as any;
		expect(body.status).toBe('ok');
	});

	it('returns a timestamp', async () => {
		const res = await fetch('/health');
		const body = (await res.json()) as any;
		expect(body.timestamp).toBeDefined();
	});

	it('returns environment field', async () => {
		const res = await fetch('/health');
		const body = (await res.json()) as any;
		expect(body.environment).toBeDefined();
	});

	it('adds CORS headers to the response', async () => {
		const res = await fetch('/health');
		expect(res.headers.get('Access-Control-Allow-Origin')).toBeTruthy();
	});
});

// ── OPTIONS preflight ─────────────────────────────────────────────────────────

describe('E2E – OPTIONS preflight', () => {
	it('returns 204 for a preflight request', async () => {
		const res = await fetch('/contact', { method: 'OPTIONS' });
		expect(res.status).toBe(204);
	});

	it('preflight response includes Access-Control-Allow-Origin', async () => {
		const res = await fetch('/contact', { method: 'OPTIONS' });
		expect(res.headers.get('Access-Control-Allow-Origin')).toBeTruthy();
	});

	it('preflight response includes Access-Control-Allow-Methods', async () => {
		const res = await fetch('/health', { method: 'OPTIONS' });
		const methods = res.headers.get('Access-Control-Allow-Methods') ?? '';
		expect(methods).toContain('GET');
	});
});

// ── POST /contact ─────────────────────────────────────────────────────────────

describe('E2E – POST /contact', () => {
	const validPayload = {
		name: 'Test User',
		email: 'test@example.com',
		message: 'This is a valid message with enough characters to pass validation.',
	};

	it('returns 201 for a valid contact submission', async () => {
		const res = await fetch('/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(validPayload),
		});
		expect(res.status).toBe(201);
	});

	it('returns success:true for a valid submission', async () => {
		const res = await fetch('/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(validPayload),
		});
		const body = (await res.json()) as any;
		expect(body.success).toBe(true);
	});

	it('returns 400 for a message shorter than 10 characters', async () => {
		const res = await fetch('/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...validPayload, message: 'short' }),
		});
		expect(res.status).toBe(400);
	});

	it('returns 400 when required fields are missing', async () => {
		const res = await fetch('/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: 'Alice' }),
		});
		expect(res.status).toBe(400);
	});

	it('returns 400 for malformed JSON', async () => {
		const res = await fetch('/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: 'not-json',
		});
		expect(res.status).toBe(400);
	});

	it('response has CORS headers', async () => {
		const res = await fetch('/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(validPayload),
		});
		expect(res.headers.get('Access-Control-Allow-Origin')).toBeTruthy();
	});

	it('error response body contains an error key', async () => {
		const res = await fetch('/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...validPayload, message: 'tiny' }),
		});
		const body = (await res.json()) as any;
		expect(body.error).toBeDefined();
	});
});

// ── GET /visit & POST /visit ──────────────────────────────────────────────────

describe('E2E – /visit', () => {
	it('POST /visit returns 201', async () => {
		const res = await fetch('/visit', { method: 'POST' });
		expect(res.status).toBe(201);
	});

	it('POST /visit returns success:true and stats', async () => {
		const res = await fetch('/visit', { method: 'POST' });
		const body = (await res.json()) as any;
		expect(body.success).toBe(true);
		expect(body.stats).toBeDefined();
	});

	it('GET /visit returns 200 with stats', async () => {
		const res = await fetch('/visit', { method: 'GET' });
		expect(res.status).toBe(200);
		const body = (await res.json()) as any;
		expect(typeof body.totalVisits).toBe('number');
	});

	it('visit count increases after POST', async () => {
		const before = (await (await fetch('/visit', { method: 'GET' })).json()) as any;
		await fetch('/visit', { method: 'POST' });
		const after = (await (await fetch('/visit', { method: 'GET' })).json()) as any;
		expect(after.totalVisits).toBeGreaterThan(before.totalVisits);
	});
});

// ── GET /admin/messages ───────────────────────────────────────────────────────

describe('E2E – GET /admin/messages', () => {
	it('returns 401 without Authorization header', async () => {
		const res = await fetch('/admin/messages');
		expect(res.status).toBe(401);
	});

	it('401 body includes an Authorization error message', async () => {
		const res = await fetch('/admin/messages');
		const body = (await res.json()) as any;
		expect(body.error).toMatch(/Authorization/i);
	});

	it('returns 401 for a wrong token', async () => {
		const res = await fetch('/admin/messages', {
			headers: { Authorization: 'Bearer wrong-key' },
		});
		expect(res.status).toBe(401);
	});

	it('returns 200 with a valid Bearer token', async () => {
		const res = await fetch('/admin/messages', {
			headers: { Authorization: `Bearer ${ADMIN_KEY}` },
		});
		expect(res.status).toBe(200);
	});

	it('returns messages array when authenticated', async () => {
		const res = await fetch('/admin/messages', {
			headers: { Authorization: `Bearer ${ADMIN_KEY}` },
		});
		const body = (await res.json()) as any;
		expect(Array.isArray(body.messages)).toBe(true);
	});

	it('authenticated response has CORS headers', async () => {
		const res = await fetch('/admin/messages', {
			headers: { Authorization: `Bearer ${ADMIN_KEY}` },
		});
		expect(res.headers.get('Access-Control-Allow-Origin')).toBeTruthy();
	});
});

// ── DELETE /admin/messages/:id ─────────────────────────────────────────────────

describe('E2E – DELETE /admin/messages/:id', () => {
	it('returns 401 without Authorization header', async () => {
		const res = await fetch('/admin/messages/msg-1', { method: 'DELETE' });
		expect(res.status).toBe(401);
	});

	it('returns 200 for a valid delete with auth', async () => {
		const res = await fetch('/admin/messages/msg-1', {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${ADMIN_KEY}` },
		});
		expect(res.status).toBe(200);
	});

	it('delete response includes success:true', async () => {
		const res = await fetch('/admin/messages/msg-42', {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${ADMIN_KEY}` },
		});
		const body = (await res.json()) as any;
		expect(body.success).toBe(true);
	});
});

// ── GET /admin/stats ──────────────────────────────────────────────────────────

describe('E2E – GET /admin/stats', () => {
	it('returns 401 without auth', async () => {
		const res = await fetch('/admin/stats');
		expect(res.status).toBe(401);
	});

	it('returns 200 with valid auth', async () => {
		const res = await fetch('/admin/stats', {
			headers: { Authorization: `Bearer ${ADMIN_KEY}` },
		});
		expect(res.status).toBe(200);
	});

	it('returns stats object with totalMessages and totalVisits', async () => {
		const res = await fetch('/admin/stats', {
			headers: { Authorization: `Bearer ${ADMIN_KEY}` },
		});
		const body = (await res.json()) as any;
		expect(typeof body.stats.totalMessages).toBe('number');
		expect(typeof body.stats.totalVisits).toBe('number');
	});
});

// ── Unknown routes ────────────────────────────────────────────────────────────

describe('E2E – 404 Not Found', () => {
	it('returns 404 for an unknown GET route', async () => {
		const res = await fetch('/this-does-not-exist');
		expect(res.status).toBe(404);
	});

	it('returns 404 for an unknown nested path', async () => {
		const res = await fetch('/api/v1/unknown');
		expect(res.status).toBe(404);
	});

	it('still adds CORS headers on 404 responses', async () => {
		const res = await fetch('/not-found');
		expect(res.headers.get('Access-Control-Allow-Origin')).toBeTruthy();
	});
});

// ── Security headers (full pipeline) ─────────────────────────────────────────

describe('E2E – Security headers', () => {
	it('includes X-Content-Type-Options: nosniff on health responses', async () => {
		const res = await fetch('/health');
		expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
	});

	it('includes X-Frame-Options: DENY on contact responses', async () => {
		const res = await fetch('/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: 'Alice',
				email: 'a@a.com',
				message: 'A long enough message for validation',
			}),
		});
		expect(res.headers.get('X-Frame-Options')).toBe('DENY');
	});

	it('includes Strict-Transport-Security header', async () => {
		const res = await fetch('/health');
		const hsts = res.headers.get('Strict-Transport-Security') ?? '';
		expect(hsts).toContain('max-age=');
	});
});

// ── Rate limiting ─────────────────────────────────────────────────────────────

describe('E2E – Rate limiting on POST /contact', () => {
	it('blocks after 10 requests from the same IP within the window', async () => {
		const RATE_LIMIT_IP = createUniqueRateLimitIp();
		const headers = {
			'Content-Type': 'application/json',
			'CF-Connecting-IP': RATE_LIMIT_IP,
		};
		const body = JSON.stringify({
			name: 'Spammer',
			email: 'spam@example.com',
			message: 'short',
		});

		// Use requests that fail validation so this test only depends on the rate limiter.
		for (let i = 0; i < 10; i++) {
			const res = await fetch('/contact', { method: 'POST', headers, body });
			console.log(`Request ${i + 1} status: ${res.status}`);
			expect(res.status).not.toBe(429);
		}

		// 11th request should be rate-limited
		const blocked = await fetch('/contact', { method: 'POST', headers, body });
		console.log(`Request 11 status: ${blocked.status}`);
		expect(blocked.status).toBe(429);
	});

	it('rate-limited response contains a user-friendly error message', async () => {
		const RATE_LIMIT_IP = createUniqueRateLimitIp();
		const headers = {
			'Content-Type': 'application/json',
			'CF-Connecting-IP': RATE_LIMIT_IP,
		};
		const body = JSON.stringify({
			name: 'Rate Limit Test',
			email: 'x@x.com',
			message: 'short',
		});

		for (let i = 0; i < 10; i++) {
			const res = await fetch('/contact', { method: 'POST', headers, body });
			expect(res.status).toBe(400);
		}

		const blocked = await fetch('/contact', { method: 'POST', headers, body });
		expect(blocked.status).toBe(429);
		const blockedBody = (await blocked.json()) as any;
		expect(blockedBody.error).toContain('Too many requests');
	});
});
