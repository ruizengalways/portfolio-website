import { saveMessage } from "../repositories/message.repository";
import { ContactInput } from "../schemas/contact.schema";

export async function sendContactMessage(
  input: ContactInput,
  env: Env
): Promise<void> {
  // Business rule example
  if (input.message.length < 10) {
    throw new Error("Message is too short");
  }

  await saveMessage(
    {
      name: input.name,
      email: input.email,
      message: input.message,
      createdAt: new Date().toISOString(),
    },
    env
  );
}