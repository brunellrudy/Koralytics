import { randomUUID } from "crypto";

export type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
};

const users = new Map<string, UserRecord>();

export function findUserByEmail(email: string) {
  return users.get(email.toLowerCase()) ?? null;
}

export function createUser({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) {
  const normalizedEmail = email.toLowerCase();
  if (users.has(normalizedEmail)) {
    return { error: "Un compte existe déjà avec cet email." } as const;
  }

  const record: UserRecord = {
    id: randomUUID(),
    fullName,
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, record);

  return { user: record } as const;
}
