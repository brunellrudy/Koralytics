import { NextResponse } from "next/server";
import { findUserByEmail } from "../auth-store";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  let body: { email?: string; password?: string } | null = null;

  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json(
      { message: "Requête invalide." },
      { status: 400 }
    );
  }

  const email = body?.email?.trim();
  const password = body?.password ?? "";

  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { message: "Adresse email invalide." },
      { status: 400 }
    );
  }

  if (!password) {
    return NextResponse.json(
      { message: "Mot de passe requis." },
      { status: 400 }
    );
  }

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return NextResponse.json(
      { message: "Identifiants incorrects." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: `Bienvenue ${user.fullName}. Connexion réussie.`,
  });
}
