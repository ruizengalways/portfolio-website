import { UnauthorizedError } from "../utils/errors";

/**
 * Authentication middleware for admin endpoints
 * Validates Bearer token from Authorization header
 */

export function getAuthToken(request: Request): string {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    throw new UnauthorizedError("Missing Authorization header");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    throw new UnauthorizedError("Invalid Authorization header format");
  }

  return parts[1];
}

/**
 * Verify Bearer token matches the admin API key from environment
 */
export function verifyAdminToken(token: string, env: Env): boolean {
  const adminApiKey = env.ADMIN_API_KEY;

  if (!adminApiKey) {
    throw new Error("ADMIN_API_KEY not configured");
  }

  return token === adminApiKey;
}

/**
 * Middleware function to protect admin routes
 * Returns true if authentication succeeds, throws if fails
 */
export function authenticateAdmin(request: Request, env: Env): boolean {
  const token = getAuthToken(request);
  
  if (!verifyAdminToken(token, env)) {
    throw new UnauthorizedError("Invalid API key");
  }

  return true;
}
