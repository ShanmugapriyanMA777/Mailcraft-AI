import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { supabase } from "@/db";
import { User } from "@/db/schema";

const SECRET_KEY = process.env.JWT_SECRET || "mailcraft-ai-development-secret-key-change-in-production-2024";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const secret = new TextEncoder().encode(SECRET_KEY);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("mailcraft_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("mailcraft_session");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mailcraft_session")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const { data: user, error } = await supabase.from('users').select('*').eq('id', payload.userId).single();
  if (error || !user) return null;

  const { passwordHash, ...safe } = user;
  return safe;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
