import { UnauthorizedError } from "./errors";

export function jsonResponse(data: any, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function parseJson(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch {
    throw new Error("Invalid JSON body");
  }
}


export function errorResponse(error: unknown): Response {
  let status = 400;
  const message =
    error instanceof Error ? error.message : "Unknown error";

  // Return 401 for authorization errors
  if (error instanceof UnauthorizedError) {
    status = 401;
  }

  return jsonResponse({ error: message }, status);
}