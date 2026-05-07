const USERNAME_MIN = 3;
const USERNAME_MAX = 24;
const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]*[a-z0-9]$/;
const USERNAME_SINGLE_CHAR_PATTERN = /^[a-z0-9]$/;

export type UsernameValidation = { valid: boolean; error?: string };

/**
 * Validates a username string.
 * Rules: 3–24 chars, lowercase letters/numbers/hyphen/underscore,
 * no leading/trailing hyphen or underscore, no spaces.
 */
export function validateUsername(value: string): UsernameValidation {
  if (!value || typeof value !== "string") {
    return { valid: false, error: "Username is required." };
  }

  const normalized = value.trim().toLowerCase();

  if (normalized.length < USERNAME_MIN) {
    return { valid: false, error: `Username must be at least ${USERNAME_MIN} characters.` };
  }

  if (normalized.length > USERNAME_MAX) {
    return { valid: false, error: `Username must be ${USERNAME_MAX} characters or fewer.` };
  }

  if (/\s/.test(normalized)) {
    return { valid: false, error: "Username cannot contain spaces." };
  }

  if (!/^[a-z0-9_-]+$/.test(normalized)) {
    return { valid: false, error: "Username can only contain lowercase letters, numbers, hyphens, and underscores." };
  }

  if (normalized.length === 1) {
    if (!USERNAME_SINGLE_CHAR_PATTERN.test(normalized)) {
      return { valid: false, error: "Single-character username must be a letter or number." };
    }
  } else if (normalized.length === 2) {
    if (!/^[a-z0-9]{2}$/.test(normalized)) {
      return { valid: false, error: "Username must start and end with a letter or number." };
    }
    // 2-char usernames are too short per min rule, but we already checked length
    return { valid: false, error: `Username must be at least ${USERNAME_MIN} characters.` };
  } else if (!USERNAME_PATTERN.test(normalized)) {
    return { valid: false, error: "Username must start and end with a letter or number." };
  }

  return { valid: true };
}

/**
 * Normalizes a username to lowercase, trimmed.
 */
export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}
