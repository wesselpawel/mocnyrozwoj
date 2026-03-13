const ADMIN_SESSION_COOKIE_NAME = "admin_session";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_ADMIN_USERNAME = "admin";

const textEncoder = new TextEncoder();

type AdminConfig = {
  username: string;
  password: string;
  sessionSecret: string;
};

const safeEqual = (a: string, b: string) => {
  const left = textEncoder.encode(a);
  const right = textEncoder.encode(b);

  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index];
  }

  return mismatch === 0;
};

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return toHex(digest);
};

export const getAdminConfig = (): AdminConfig | null => {
  const username = process.env.ADMIN_USERNAME?.trim() || DEFAULT_ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD?.trim();
  const sessionSecret =
    process.env.ADMIN_SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim();

  if (!password || !sessionSecret) {
    return null;
  }

  return {
    username,
    password,
    sessionSecret,
  };
};

export const isAdminAuthConfigured = () => Boolean(getAdminConfig());

export const getAdminSessionCookieName = () => ADMIN_SESSION_COOKIE_NAME;

export const getAdminSessionMaxAgeSeconds = () => ADMIN_SESSION_MAX_AGE_SECONDS;

export const buildAdminSessionToken = async () => {
  const config = getAdminConfig();
  if (!config) {
    return null;
  }

  return sha256(`${config.username}:${config.password}:${config.sessionSecret}`);
};

export const isValidAdminCredentials = (username: string, password: string) => {
  const config = getAdminConfig();
  if (!config) {
    return false;
  }

  const normalizedUsername = username.trim().toLowerCase();
  const expectedUsername = config.username.toLowerCase();
  const exactPasswordMatch = safeEqual(password, config.password);
  const trimmedPasswordMatch = safeEqual(password.trim(), config.password);

  return (
    safeEqual(normalizedUsername, expectedUsername) &&
    (exactPasswordMatch || trimmedPasswordMatch)
  );
};

export const isValidAdminSessionToken = async (token: string | undefined) => {
  if (!token) {
    return false;
  }

  const expected = await buildAdminSessionToken();
  if (!expected) {
    return false;
  }

  return safeEqual(token, expected);
};
