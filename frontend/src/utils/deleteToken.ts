/**
 * Hash a delete token using SHA-256 (browser implementation)
 */
export const hashDeleteToken = async (token: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * Get or create delete token for a note
 */
export const getDeleteToken = (noteName: string): string | null => {
  return localStorage.getItem(`deleteToken_${noteName}`);
};

/**
 * Save delete token for a note
 */
export const saveDeleteToken = (noteName: string, token: string): void => {
  localStorage.setItem(`deleteToken_${noteName}`, token);
};

/**
 * Remove delete token for a note
 */
export const removeDeleteToken = (noteName: string): void => {
  localStorage.removeItem(`deleteToken_${noteName}`);
};
