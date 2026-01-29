import { NextResponse } from "next/server";
import { findUserByEmail } from "../auth-store";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  let body: { email?: string } | null = null;

  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json(
      { message: "Requête invalide." },
      { status: 400 }
    );
  }

  const email = body?.email?.trim();

  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { message: "Adresse email invalide." },
      { status: 400 }
    );
  }

  const user = findUserByEmail(email);
  if (!user) {
    return NextResponse.json(
      { message: "Aucun compte trouvé pour cet email." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Un lien de réinitialisation a été envoyé par email.",
  });
}
