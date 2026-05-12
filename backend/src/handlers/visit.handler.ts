import { jsonResponse, errorResponse } from "../utils/response";
import { recordVisit, getVisitorStats } from "../repositories/message.repository";

/**
 * Handle visitor tracking.
 * POST /visit records a page visit.
 * GET /visit returns current visitor statistics.
 */
export async function visitHandler(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    if (request.method === "POST") {
      // Record a new visit
      await recordVisit(env);
      const stats = await getVisitorStats(env);
      return jsonResponse({ success: true, stats }, 201);
    } else if (request.method === "GET") {
      // Return current statistics
      const stats = await getVisitorStats(env);
      return jsonResponse(stats, 200);
    } else {
      return new Response("Method not allowed", { status: 405 });
    }
  } catch (error) {
    return errorResponse(error);
  }
}
