import { jsonResponse, errorResponse } from "../utils/response";
import { authenticateAdmin } from "../middleware/auth.middleware";

/**
 * Admin handler to list all contact messages
 * Requires Bearer token authentication
 */
export async function adminListMessagesHandler(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    authenticateAdmin(request, env);

    // TODO: Implement message retrieval from KV storage
    // For now, return placeholder response
    const messages = [
      {
        id: "msg-1",
        name: "John Doe",
        email: "john@example.com",
        message: "Great portfolio!",
        timestamp: new Date().toISOString(),
      },
    ];

    return jsonResponse({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Admin handler to delete a specific message
 * Requires Bearer token authentication
 */
export async function adminDeleteMessageHandler(
  request: Request,
  env: Env,
  messageId: string
): Promise<Response> {
  try {
    authenticateAdmin(request, env);

    // TODO: Implement message deletion from KV storage
    // For now, return placeholder response
    if (!messageId) {
      return errorResponse(new Error("Message ID is required"));
    }

    return jsonResponse({
      success: true,
      message: `Message ${messageId} deleted successfully`,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Admin handler to get statistics
 * Requires Bearer token authentication
 */
export async function adminStatsHandler(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    authenticateAdmin(request, env);

    // TODO: Implement stats retrieval from KV storage
    const stats = {
      totalMessages: 0,
      totalVisits: 0,
      lastMessageTime: null,
      lastUpdated: new Date().toISOString(),
    };

    return jsonResponse({
      success: true,
      stats,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
