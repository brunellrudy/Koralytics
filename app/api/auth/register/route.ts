import { NextResponse } from "next/server";
import { createUser } from "../auth-store";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  let body:
    | {
        fullName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      }
    | null = null;

  try {
    body = (await request.json()) as {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };
  } catch {
    return NextResponse.json(
      { message: "Requête invalide." },
      { status: 400 }
    );
  }

  const fullName = body?.fullName?.trim();
  const email = body?.email?.trim();
  const password = body?.password ?? "";
  const confirmPassword = body?.confirmPassword ?? "";

  if (!fullName) {
    return NextResponse.json(
      { message: "Le nom complet est requis." },
      { status: 400 }
    );
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { message: "Adresse email invalide." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Le mot de passe doit contenir au moins 8 caractères." },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { message: "Les mots de passe ne correspondent pas." },
      { status: 400 }
    );
  }

  const result = createUser({ fullName, email, password });
  if ("error" in result) {
    return NextResponse.json({ message: result.error }, { status: 409 });
  }

  return NextResponse.json({
    message: `Compte créé pour ${result.user.fullName}.`,
  });
}
