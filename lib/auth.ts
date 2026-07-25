import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "brightpath_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is missing. Open .env.local and make sure AUTH_SECRET is set.",
    );
  }
  return secret;
}

function getDashboardPassword() {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    throw new Error(
      "DASHBOARD_PASSWORD is missing. Open .env.local and set a dashboard password.",
    );
  }
  return password;
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("hex");
}

export function createSessionToken() {
  const issuedAt = Date.now().toString();
  const payload = `dashboard:${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (provided.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(provided, expectedBuffer)) return false;

  const [, issuedAtRaw] = payload.split(":");
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;

  const ageMs = Date.now() - issuedAt;
  return ageMs >= 0 && ageMs <= SESSION_MAX_AGE_SECONDS * 1000;
}

export function verifyDashboardPassword(password: string) {
  const expected = getDashboardPassword();
  const provided = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);

  if (provided.length !== expectedBuffer.length) {
    // Still run a comparison path to reduce timing variance for wrong lengths
    timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }

  return timingSafeEqual(provided, expectedBuffer);
}

export async function setSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return false;
  }
  return true;
}
