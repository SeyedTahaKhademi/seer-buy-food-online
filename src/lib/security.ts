/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Security and Encryption Utility for "Seer" Diet Platform
 * Handles secure cryptographic encoding/XOR obfuscation for sensitive client data saved in localStorage.
 */

// Secret key for client-side data encryption
const SECRET_CRYPTO_KEY = "SeerDietSecretKey_2026_Athletes";

/**
 * Encrypts a string or object using standard XOR cipher + Base64 encoding
 * to prevent clear-text reading in browser developer tools (localStorage).
 */
export function encryptData(data: any): string {
  if (data === null || data === undefined) return '';
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
  
  let result = '';
  for (let i = 0; i < jsonString.length; i++) {
    // XOR operation with secret key
    const charCode = jsonString.charCodeAt(i) ^ SECRET_CRYPTO_KEY.charCodeAt(i % SECRET_CRYPTO_KEY.length);
    result += String.fromCharCode(charCode);
  }
  
  // Convert to Base64 to make it safe for storage strings
  try {
    return btoa(unescape(encodeURIComponent(result)));
  } catch (e) {
    return btoa(result);
  }
}

/**
 * Decrypts a previously encrypted Base64 string back into its original JSON or string form.
 */
export function decryptData<T = any>(encryptedStr: string | null): T | null {
  if (!encryptedStr) return null;
  
  try {
    // Decode from Base64
    let decodedBase64 = '';
    try {
      decodedBase64 = decodeURIComponent(escape(atob(encryptedStr)));
    } catch (e) {
      decodedBase64 = atob(encryptedStr);
    }
    
    let result = '';
    for (let i = 0; i < decodedBase64.length; i++) {
      // XOR operation with secret key to reverse
      const charCode = decodedBase64.charCodeAt(i) ^ SECRET_CRYPTO_KEY.charCodeAt(i % SECRET_CRYPTO_KEY.length);
      result += String.fromCharCode(charCode);
    }
    
    // Attempt to parse as JSON if it's stringified JSON
    try {
      return JSON.parse(result) as T;
    } catch (e) {
      return result as unknown as T;
    }
  } catch (error) {
    console.error("Decryption failed. Data might be corrupted or in clear-text.", error);
    return null;
  }
}

/**
 * Secure local storage wrappers that automatically handle encryption/decryption.
 */
export const secureStorage = {
  setItem: (key: string, value: any): void => {
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
  },
  
  getItem: <T = any>(key: string): T | null => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    
    // Check if the item is already encrypted (usually starts with standard Base64 characters and is not valid JSON)
    const isEncrypted = !raw.trim().startsWith('{') && !raw.trim().startsWith('[');
    if (isEncrypted) {
      return decryptData<T>(raw);
    }
    
    // Fallback for pre-existing clear-text data (convert it to secure on-the-fly)
    try {
      const parsed = JSON.parse(raw);
      secureStorage.setItem(key, parsed);
      return parsed as T;
    } catch (e) {
      // If it's a raw string
      secureStorage.setItem(key, raw);
      return raw as unknown as T;
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
};
