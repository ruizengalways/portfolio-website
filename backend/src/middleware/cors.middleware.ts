export function applyCors(response: Response, env?: Env): Response {
  const headers = new Headers(response.headers);

  // CORS headers
  const allowedOrigin = env?.FRONTEND_URL || "*";
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
  headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  headers.set("Access-Control-Max-Age", "3600");

  // Security headers
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  // Note: CSP is commented out as it may be too restrictive for API responses
  // headers.set("Content-Security-Policy", "default-src 'self'");

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}