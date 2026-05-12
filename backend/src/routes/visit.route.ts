import { visitHandler } from "../handlers/visit.handler";

export async function handleVisitRoute(
  request: Request,
  env: Env
): Promise<Response> {
  return visitHandler(request, env);
}
