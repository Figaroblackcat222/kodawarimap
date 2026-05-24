/**
 * クラウド同期セットアップシート
 *
 * - ログイン: メール + パスフレーズ → login → salt 取得 → 鍵導出
 * - リロード後鍵再入力: パスフレーズのみ → 既存 salt で鍵導出
 *
 * 新規登録は現在招待制のため UI を非表示とする。
 */
import { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { cloudflareSyncRepository } from "@infrastructure/sync/cloudflare-sync-repository";
import { authService } from "@infrastructure/sync/auth-service";
import { webCryptoService } from "@infrastructure/sync/web-crypto-service";

/** Uint8Array を base64 文字列に変換 */
function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** base64 エンコード（ArrayBuffer → string） */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** SHA-256 ハッシュを base64 文字列で返す */
async function hashPassphrase(passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(passphrase));
  return arrayBufferToBase64(hashBuffer);
}

interface SyncSetupSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (key: CryptoKey) => void;
}

type ModeType = "auth" | "reenter" | "request";

export function SyncSetupSheet({ isOpen, onClose, onSuccess }: SyncSetupSheetProps) {
  const [email, setEmail] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [passphraseConfirm, setPassphraseConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [requestMode, setRequestMode] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // ログイン済みだが鍵がない状態（ページリロード後）
  const baseMode: "auth" | "reenter" = authService.isLoggedIn() ? "reenter" : "auth";
  const mode: ModeType = baseMode === "auth" && requestMode ? "request" : baseMode;

  const isLoading = isSubmitting;

  const handleLogin = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const passwordHash = await hashPassphrase(passphrase);
      const { accessToken, refreshToken, salt } = await cloudflareSyncRepository.login(
        email,
        passwordHash
      );
      authService.saveTokens(accessToken, refreshToken);
      authService.saveEmail(email);
      authService.saveSalt(salt);

      const key = await _deriveKeyDirectly(passphrase, salt);
      onSuccess(key);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReenter = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const saltBase64 = authService.getSalt();
      if (!saltBase64) {
        throw new Error("Salt が見つかりません。一度ログアウトして再登録してください。");
      }
      const key = await _deriveKeyDirectly(passphrase, saltBase64);
      onSuccess(key);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "鍵の生成に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const rt = authService.getRefreshToken();
      if (rt) await cloudflareSyncRepository.logout(rt).catch(() => {});
    } catch {
      // ignore
    }
    authService.clearAll();
    setEmail("");
    setPassphrase("");
    setErrorMessage(null);
  };

  const handleRequest = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const passwordHash = await hashPassphrase(passphrase);
      const saltBytes = webCryptoService.generateSalt();
      const salt = uint8ToBase64(saltBytes);
      await cloudflareSyncRepository.requestRegistration(email, passwordHash, salt);
      setRequestSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "申請に失敗しました";
      if (msg === "email_already_registered") {
        setErrorMessage("このメールアドレスはすでに登録済みです。");
      } else if (msg === "request_already_pending") {
        setErrorMessage("このメールアドレスはすでに申請済みです。承認をお待ちください。");
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToLogin = () => {
    setRequestMode(false);
    setRequestSent(false);
    setEmail("");
    setPassphrase("");
    setPassphraseConfirm("");
    setErrorMessage(null);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--bg-primary)",
          borderRadius: "16px 16px 0 0",
          width: "100%",
          maxWidth: 480,
          padding: "24px 20px 40px",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            {mode === "reenter"
              ? "パスフレーズを入力"
              : mode === "request"
                ? "同期アカウントを申請する"
                : "クラウド同期を設定する"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              padding: 4,
            }}
          >
            <X size={22} />
          </button>
        </div>

        {mode === "reenter" ? (
          /* --- 鍵再入力モード --- */
          <div>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              ページを再読み込みしたため、パスフレーズを再入力してください。
              鍵はこのデバイスのメモリにのみ保持されます。
            </p>
            <PasswordInput
              value={passphrase}
              onChange={setPassphrase}
              show={showPass}
              onToggleShow={() => setShowPass((v) => !v)}
              disabled={isLoading}
            />
            {errorMessage && <ErrorBanner message={errorMessage} />}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={onClose} disabled={isLoading} style={secondaryBtnStyle}>
                キャンセル
              </button>
              <button
                onClick={handleReenter}
                disabled={isLoading || !passphrase}
                style={primaryBtnStyle(isLoading || !passphrase)}
              >
                {isLoading ? <LoadingContent label="鍵を生成中..." /> : "続ける"}
              </button>
            </div>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: 12,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                ログアウトする
              </button>
            </div>
          </div>
        ) : mode === "request" ? (
          /* --- 申請モード --- */
          <div>
            {requestSent ? (
              <div>
                <p
                  style={{
                    margin: "0 0 20px",
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    background: "#f0fdf4",
                    border: "1px solid #86efac",
                    padding: "12px 14px",
                    borderRadius: 8,
                  }}
                >
                  申請を受け付けました。管理者の承認後にご利用いただけます。
                </p>
                <button onClick={goToLogin} style={secondaryBtnStyle}>
                  ログインに戻る
                </button>
              </div>
            ) : (
              <div>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  メールアドレスとパスフレーズを設定してください。パスフレーズはデータの暗号化に使用するため、忘れた場合は復元できません。
                </p>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>メールアドレス</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="your@example.com"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>パスフレーズ</label>
                  <PasswordInput
                    value={passphrase}
                    onChange={setPassphrase}
                    show={showPass}
                    onToggleShow={() => setShowPass((v) => !v)}
                    disabled={isLoading}
                  />
                </div>
                <div style={{ marginBottom: 4 }}>
                  <label style={labelStyle}>パスフレーズ（確認）</label>
                  <PasswordInput
                    value={passphraseConfirm}
                    onChange={setPassphraseConfirm}
                    show={showPassConfirm}
                    onToggleShow={() => setShowPassConfirm((v) => !v)}
                    disabled={isLoading}
                    placeholder="もう一度入力してください"
                  />
                  {passphraseConfirm && passphrase !== passphraseConfirm && (
                    <p style={{ margin: "6px 0 0", fontSize: 12, color: "#dc2626" }}>
                      パスフレーズが一致しません
                    </p>
                  )}
                </div>
                {errorMessage && <ErrorBanner message={errorMessage} />}
                <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                  <button onClick={goToLogin} disabled={isLoading} style={secondaryBtnStyle}>
                    戻る
                  </button>
                  <button
                    onClick={handleRequest}
                    disabled={
                      isLoading || !email || !passphrase || passphrase !== passphraseConfirm
                    }
                    style={primaryBtnStyle(
                      isLoading || !email || !passphrase || passphrase !== passphraseConfirm
                    )}
                  >
                    {isLoading ? <LoadingContent label="送信中..." /> : "申請する"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --- ログインモード（新規登録は招待制のため非表示） --- */
          <div>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                background: "var(--bg-secondary, #f5f5f5)",
                padding: "10px 12px",
                borderRadius: 8,
              }}
            >
              クラウド同期は現在招待制です。アカウントをお持ちの方はログインしてください。
            </p>

            {/* メール入力 */}
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="your@example.com"
                style={inputStyle}
              />
            </div>

            {/* パスフレーズ入力 */}
            <div style={{ marginBottom: 4 }}>
              <label style={labelStyle}>パスフレーズ</label>
              <PasswordInput
                value={passphrase}
                onChange={setPassphrase}
                show={showPass}
                onToggleShow={() => setShowPass((v) => !v)}
                disabled={isLoading}
              />
            </div>

            {errorMessage && <ErrorBanner message={errorMessage} />}

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={onClose} disabled={isLoading} style={secondaryBtnStyle}>
                キャンセル
              </button>
              <button
                onClick={handleLogin}
                disabled={isLoading || !email || !passphrase}
                style={primaryBtnStyle(isLoading || !email || !passphrase)}
              >
                {isLoading ? <LoadingContent label="鍵を生成中..." /> : "ログイン"}
              </button>
            </div>

            <div style={{ marginTop: 14, textAlign: "center" }}>
              <button
                onClick={() => setRequestMode(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6366f1",
                  fontSize: 13,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                アカウントをお申し込みの方はこちら →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- PBKDF2 鍵導出（コンポーネント内で直接呼ぶ用） ---

async function _deriveKeyDirectly(passphrase: string, saltBase64: string): Promise<CryptoKey> {
  const binary = atob(saltBase64);
  const saltBytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    saltBytes[i] = binary.charCodeAt(i);
  }
  return webCryptoService.deriveKey(passphrase, saltBytes);
}

// --- 共通スタイル・小コンポーネント ---

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-secondary)",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 14,
  background: "var(--input-bg)",
  color: "var(--text-primary)",
  outline: "none",
  boxSizing: "border-box",
};

const secondaryBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px 0",
  border: "1px solid var(--border)",
  borderRadius: 10,
  background: "var(--bg-primary)",
  color: "var(--text-secondary)",
  fontSize: 14,
  cursor: "pointer",
};

function primaryBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    flex: 2,
    padding: "12px 0",
    border: "none",
    borderRadius: 10,
    background: disabled ? "var(--border)" : "#6366f1",
    color: disabled ? "var(--text-muted)" : "#fff",
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    transition: "background 0.15s",
  };
}

function PasswordInput({
  value,
  onChange,
  show,
  onToggleShow,
  disabled,
  placeholder = "パスフレーズを入力",
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        style={{ ...inputStyle, paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={onToggleShow}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          padding: 4,
        }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        marginTop: 12,
        padding: "10px 12px",
        borderRadius: 8,
        background: "#fef2f2",
        border: "1px solid #fca5a5",
        color: "#dc2626",
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}

function LoadingContent({ label }: { label: string }) {
  return (
    <>
      <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />
      {label}
    </>
  );
}
