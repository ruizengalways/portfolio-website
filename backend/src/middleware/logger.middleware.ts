export function logRequest(request: Request): void {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
}