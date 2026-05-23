/**
 * パスフレーズから暗号鍵を導出するフック
 *
 * 鍵はメモリのみに保持し、localStorage には保存しない。
 * PBKDF2 (600K iterations) は 1〜2 秒かかるため isDerivingKey で UI をブロックする。
 */
import { useState, useCallback } from "react";
import { webCryptoService } from "@infrastructure/sync/web-crypto-service";
import { authService } from "@infrastructure/sync/auth-service";

/** base64 文字列を Uint8Array に変換 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface UseKeyDerivationResult {
  encryptionKey: CryptoKey | null;
  isDerivingKey: boolean;
  deriveFromPassphrase: (passphrase: string) => Promise<void>;
  clearKey: () => void;
}

export function useKeyDerivation(): UseKeyDerivationResult {
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [isDerivingKey, setIsDerivingKey] = useState(false);

  const deriveFromPassphrase = useCallback(async (passphrase: string): Promise<void> => {
    const saltBase64 = authService.getSalt();
    if (!saltBase64) {
      throw new Error("Salt not found. Please log in first.");
    }
    setIsDerivingKey(true);
    try {
      const saltBytes = base64ToUint8Array(saltBase64);
      const key = await webCryptoService.deriveKey(passphrase, saltBytes);
      setEncryptionKey(key);
    } finally {
      setIsDerivingKey(false);
    }
  }, []);

  const clearKey = useCallback(() => {
    setEncryptionKey(null);
  }, []);

  return { encryptionKey, isDerivingKey, deriveFromPassphrase, clearKey };
}
