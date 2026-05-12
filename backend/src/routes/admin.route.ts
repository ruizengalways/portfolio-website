import {
  adminListMessagesHandler,
  adminDeleteMessageHandler,
  adminStatsHandler,
} from "../handlers/admin.handler";

/**
 * Handle admin endpoints
 * Routes: /admin/messages, /admin/messages/:id, /admin/stats
 */
export function handleAdminRoute(
  request: Request,
  env: Env,
  pathname: string
): Promise<Response> | null {
  const method = request.method;

  // GET /admin/messages - List all messages
  if (pathname === "/admin/messages" && method === "GET") {
    return adminListMessagesHandler(request, env);
  }

  // DELETE /admin/messages/:id - Delete a message
  if (pathname.startsWith("/admin/messages/") && method === "DELETE") {
    const messageId = pathname.replace("/admin/messages/", "");
    return adminDeleteMessageHandler(request, env, messageId);
  }

  // GET /admin/stats - Get stats
  if (pathname === "/admin/stats" && method === "GET") {
    return adminStatsHandler(request, env);
  }

  return null;
}
