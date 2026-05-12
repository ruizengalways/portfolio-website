import { healthHandler } from "../handlers/health.handler";

export async function handleHealthRoute(env: Env): Promise<Response> {
  return healthHandler(env);
}