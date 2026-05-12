import { contactHandler } from "../handlers/contact.handler";

export async function handleContactRoute(
  request: Request,
  env: Env
): Promise<Response> {
  return contactHandler(request, env);
}