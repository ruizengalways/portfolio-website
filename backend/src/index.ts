/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;

import { handleHealthRoute } from './routes/health.route';
import { handleContactRoute } from './routes/contact.route';
import { handleVisitRoute } from './routes/visit.route';
import { handleAdminRoute } from './routes/admin.route';
import { applyCors } from './middleware/cors.middleware';
import { logRequest } from './middleware/logger.middleware';
import { checkRateLimit, getClientIp } from './middleware/ratelimit.middleware';
import { jsonResponse } from './utils/response';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		logRequest(request);

		const url = new URL(request.url);
		const method = request.method;
		const pathname = url.pathname;

		if (method === 'OPTIONS') {
			// Create a successful empty response specifically for the browser's handshake
			return applyCors(new Response(null, { status: 204 }), env);
		}

		let response: Response;

		// Handle admin routes (authenticated)
		if (pathname.startsWith('/admin/')) {
			const adminResponse = handleAdminRoute(request, env, pathname);
			if (adminResponse) {
				response = await adminResponse;
			} else {
				response = new Response('Not Found', { status: 404 });
			}
		}
		// Public routes with public access
		else if (pathname === '/health' && method === 'GET') {
			response = await handleHealthRoute(env);
		} else if (pathname === '/contact' && method === 'POST') {
			// Apply rate limiting to contact endpoint
			const clientIp = getClientIp(request);
			const isAllowed = await checkRateLimit(env.RATE_LIMIT_KV, clientIp, '/contact');

			if (!isAllowed) {
				response = jsonResponse({ error: 'Too many requests. Please try again later.' }, 429);
			} else {
				response = await handleContactRoute(request, env);
			}
		} else if (pathname === '/visit' && (method === 'POST' || method === 'GET')) {
			response = await handleVisitRoute(request, env);
		} else {
			response = new Response('Not Found', { status: 404 });
		}

		return applyCors(response, env);
	},
};
