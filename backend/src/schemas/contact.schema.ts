export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export function validateContactInput(input: any): ContactInput {
  if (
    typeof input !== "object" ||
    typeof input.name !== "string" ||
    typeof input.email !== "string" ||
    typeof input.message !== "string"
  ) {
    throw new Error("Invalid contact payload");
  }

  return {
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
  };
}