import { parseJson } from "../utils/response";
import { validateContactInput } from "../schemas/contact.schema";
import { sendContactMessage } from "../services/contact.service";
import { jsonResponse, errorResponse } from "../utils/response";

export async function contactHandler(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = await parseJson(request);
    const data = validateContactInput(body);

    await sendContactMessage(data, env);

    return jsonResponse({ success: true }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}