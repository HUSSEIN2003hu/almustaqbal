import { adminDb } from "~/server/units/firebase-admin";

const CODE_LENGTH = 8;
const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export async function generateActivationCode(): Promise<string> {
  let code: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random code
    code = Array.from(
      { length: CODE_LENGTH },
      () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
    ).join("");

    // Check if code already exists
    const codeDoc = await adminDb.collection("activationCodes").doc(code).get();
    isUnique = !codeDoc.exists;
  }

  return code;
} 