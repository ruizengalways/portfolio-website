import { describe, it, expect } from 'vitest';
import { getAuthToken, verifyAdminToken, authenticateAdmin } from '../../../src/middleware/auth.middleware';
import { UnauthorizedError } from '../../../src/utils/errors';
import { createMockEnv } from '../../helpers/mock-env';

// ── Helpers ──────────────────────────────────────────────────────────────────

function requestWithAuth(value: string): Request {
	return new Request('http://example.com/admin', {
		headers: { Authorization: value },
	});
}

function requestWithoutAuth(): Request {
	return new Request('http://example.com/admin');
}

// ── getAuthToken ──────────────────────────────────────────────────────────────
describe('getAuthToken', () => {
	it('throws UnauthorizedError when Authorization header is absent', () => {
		expect(() => getAuthToken(requestWithoutAuth())).toThrow(UnauthorizedError);
		expect(() => getAuthToken(requestWithoutAuth())).toThrow('Missing Authorization header');
	});

	it('throws UnauthorizedError for non-Bearer scheme', () => {
		expect(() => getAuthToken(requestWithAuth('Basic dXNlcjpwYXNz'))).toThrow(UnauthorizedError);
	});

	it('throws UnauthorizedError when scheme is Bearer but token is missing', () => {
		expect(() => getAuthToken(requestWithAuth('Bearer'))).toThrow(UnauthorizedError);
	});

	it('throws UnauthorizedError for Bearer with extra spaces (3 parts)', () => {
		expect(() => getAuthToken(requestWithAuth('Bearer token extra'))).toThrow(UnauthorizedError);
	});

	it('returns the token for a well-formed Bearer header', () => {
		const token = getAuthToken(requestWithAuth('Bearer my-secret-token'));
		expect(token).toBe('my-secret-token');
	});

	it("is case-insensitive for the 'bearer' scheme keyword", () => {
		const token = getAuthToken(requestWithAuth('BEARER my-secret-token'));
		expect(token).toBe('my-secret-token');
	});

	it('preserves token casing', () => {
		const token = getAuthToken(requestWithAuth('Bearer ABC-def-123'));
		expect(token).toBe('ABC-def-123');
	});
});

// ── verifyAdminToken ─────────────────────────────────────────────────────────

describe('verifyAdminToken', () => {
	it('returns true when token matches ADMIN_API_KEY', () => {
		const env = createMockEnv({ ADMIN_API_KEY: 'correct-key' });
		expect(verifyAdminToken('correct-key', env)).toBe(true);
	});

	it('returns false when token does not match ADMIN_API_KEY', () => {
		const env = createMockEnv({ ADMIN_API_KEY: 'correct-key' });
		expect(verifyAdminToken('wrong-key', env)).toBe(false);
	});

	it('throws when ADMIN_API_KEY is not configured', () => {
		const env = createMockEnv({ ADMIN_API_KEY: undefined });
		expect(() => verifyAdminToken('any-token', env)).toThrow('ADMIN_API_KEY not configured');
	});

	it('is case-sensitive for token comparison', () => {
		const env = createMockEnv({ ADMIN_API_KEY: 'MyKey' });
		expect(verifyAdminToken('mykey', env)).toBe(false);
		expect(verifyAdminToken('MyKey', env)).toBe(true);
	});

	it('throws when ADMIN_API_KEY is an empty string (treated as not configured)', () => {
		// Empty string is falsy, so the implementation treats it as missing
		const env = createMockEnv({ ADMIN_API_KEY: '' });
		expect(() => verifyAdminToken('', env)).toThrow('ADMIN_API_KEY not configured');
	});
});

// ── authenticateAdmin ─────────────────────────────────────────────────────────

describe('authenticateAdmin', () => {
	it('returns true when valid Bearer token matches ADMIN_API_KEY', () => {
		const env = createMockEnv({ ADMIN_API_KEY: 'secret' });
		const req = requestWithAuth('Bearer secret');
		expect(authenticateAdmin(req, env)).toBe(true);
	});

	it('throws UnauthorizedError when Authorization header is missing', () => {
		const env = createMockEnv({ ADMIN_API_KEY: 'secret' });
		expect(() => authenticateAdmin(requestWithoutAuth(), env)).toThrow(UnauthorizedError);
	});

	it('throws UnauthorizedError when token is wrong', () => {
		const env = createMockEnv({ ADMIN_API_KEY: 'correct' });
		const req = requestWithAuth('Bearer wrong');
		expect(() => authenticateAdmin(req, env)).toThrow(UnauthorizedError);
		expect(() => authenticateAdmin(req, env)).toThrow('Invalid API key');
	});

	it('throws when ADMIN_API_KEY is not configured', () => {
		const env = createMockEnv({ ADMIN_API_KEY: undefined });
		const req = requestWithAuth('Bearer anything');
		expect(() => authenticateAdmin(req, env)).toThrow('ADMIN_API_KEY not configured');
	});

	it('throws UnauthorizedError for non-Bearer scheme', () => {
		const env = createMockEnv({ ADMIN_API_KEY: 'secret' });
		const req = requestWithAuth('Basic c2VjcmV0');
		expect(() => authenticateAdmin(req, env)).toThrow(UnauthorizedError);
	});
});
