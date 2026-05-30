/**
 * クラウド同期セットアップシート
 *
 * - ログイン: メール + パスフレーズ → login → salt 取得 → 鍵導出
 * - リロード後鍵再入力: パスフレーズのみ → 既存 salt で鍵導出
 *
 * 新規登録は現在招待制のため UI を非表示とする。
 */
import { useState } from "react";
import { X, Eye, EyeOff, Loader2, Fingerprint } from "lucide-react";
import { cloudflareSyncRepository } from "@infrastructure/sync/cloudflare-sync-repository";
import { authService } from "@infrastructure/sync/auth-service";
import { webCryptoService } from "@infrastructure/sync/web-crypto-service";
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from "@application/ports/sync-repository";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";

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
  /** 招待トークン（仮アカウント有効化フロー用） */
  inviteToken?: string;
  /** 招待先メールアドレス（表示専用） */
  inviteEmail?: string;
}

type ModeType = "auth" | "reenter" | "request" | "passkey" | "invite-activate";

interface PasskeyData {
  session: string;
  challenge: string;
  credentialIds: string[];
  salt: string;
}

export function SyncSetupSheet({
  isOpen,
  onClose,
  onSuccess,
  inviteToken,
  inviteEmail,
}: SyncSetupSheetProps) {
  const [email, setEmail] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [passphraseConfirm, setPassphraseConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [requestMode, setRequestMode] = useState(false);
  const [passkeyMode, setPasskeyMode] = useState(false);
  const [passkeyData, setPasskeyData] = useState<PasskeyData | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [forcePasskeyRegister, setForcePasskeyRegister] = useState(false);
  const [passkeyRegPhase, setPasskeyRegPhase] = useState<"idle" | "creating" | "naming" | "saving">(
    "idle"
  );
  const [passkeyRegCredential, setPasskeyRegCredential] = useState<RegistrationResponseJSON | null>(
    null
  );
  const [passkeyRegDeviceName, setPasskeyRegDeviceName] = useState("");
  const [pendingCryptoKey, setPendingCryptoKey] = useState<CryptoKey | null>(null);

  if (!isOpen) return null;

  // ログイン済みだが鍵がない状態（ページリロード後）
  const baseMode: "auth" | "reenter" = authService.isLoggedIn() ? "reenter" : "auth";
  const mode: ModeType =
    inviteToken && inviteEmail && !authService.isLoggedIn()
      ? "invite-activate"
      : passkeyMode
        ? "passkey"
        : baseMode === "auth" && requestMode
          ? "request"
          : baseMode;

  const isLoading = isSubmitting;

  const handleLogin = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const passwordHash = await hashPassphrase(passphrase);
      const result = await cloudflareSyncRepository.login(email, passwordHash);

      if ("requires_passkey" in result) {
        setPasskeyData({
          session: result.passkey_session,
          challenge: result.challenge,
          credentialIds: result.credential_ids,
          salt: result.salt,
        });
        setPasskeyMode(true);
        return;
      }

      authService.saveTokens(result.accessToken, result.refreshToken);
      authService.saveEmail(email);
      authService.saveSalt(result.salt);

      const key = await _deriveKeyDirectly(passphrase, result.salt);

      const credentials = await cloudflareSyncRepository.listPasskeyCredentials();
      if (credentials.length === 0) {
        setPendingCryptoKey(key);
        setPasskeyRegDeviceName(getDefaultDeviceName());
        setForcePasskeyRegister(true);
        return;
      }

      onSuccess(key);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForcePasskeyBegin = async () => {
    setErrorMessage(null);
    setPasskeyRegPhase("creating");
    try {
      const options = await cloudflareSyncRepository.beginPasskeyRegistration();
      const credential = await createPasskeyCredential(options);
      setPasskeyRegCredential(credential);
      setPasskeyRegPhase("naming");
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "パスキーの作成に失敗しました");
      setPasskeyRegPhase("idle");
    }
  };

  const handleForcePasskeyComplete = async () => {
    if (!passkeyRegCredential || !pendingCryptoKey) return;
    setErrorMessage(null);
    setPasskeyRegPhase("saving");
    try {
      await cloudflareSyncRepository.completePasskeyRegistration(
        passkeyRegCredential,
        passkeyRegDeviceName || getDefaultDeviceName()
      );
      authService.savePasskeyEnabled(true);
      onSuccess(pendingCryptoKey);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "パスキーの保存に失敗しました");
      setPasskeyRegPhase("idle");
    }
  };

  const handlePasskeyVerify = async () => {
    if (!passkeyData) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const assertion = await getPasskeyAssertion(passkeyData.challenge, passkeyData.credentialIds);
      const result = await cloudflareSyncRepository.verifyPasskeyAuth(
        passkeyData.session,
        assertion
      );
      authService.saveTokens(result.accessToken, result.refreshToken);
      authService.saveEmail(email);
      authService.saveSalt(passkeyData.salt);
      authService.savePasskeyEnabled(true);

      const key = await _deriveKeyDirectly(passphrase, passkeyData.salt);
      onSuccess(key);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "認証に失敗しました");
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

  const handleActivateInviteSubmit = async () => {
    if (!inviteToken) return;
    if (passphrase !== passphraseConfirm) {
      setErrorMessage("パスフレーズが一致しません");
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const passwordHash = await hashPassphrase(passphrase);
      const saltBytes = webCryptoService.generateSalt();
      const salt = uint8ToBase64(saltBytes);
      const result = await cloudflareSyncRepository.activateInvite(inviteToken, passwordHash, salt);
      authService.saveTokens(result.accessToken, result.refreshToken);
      authService.saveEmail(inviteEmail ?? "");
      authService.saveSalt(result.salt);
      authService.savePlan(result.plan);
      authService.saveRole(result.role);
      const key = await _deriveKeyDirectly(passphrase, result.salt);
      // 招待メンバーはまだ free プラン（seat 付与前）のため listPasskeyCredentials が
      // pro_required で失敗する。パスキー登録は seat 付与後の次回ログイン時に促す。
      onSuccess(key);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "参加に失敗しました");
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
            {forcePasskeyRegister
              ? "パスキーを登録してください"
              : mode === "passkey"
                ? "デバイス認証"
                : mode === "reenter"
                  ? "パスフレーズを入力"
                  : mode === "request"
                    ? "同期アカウントを申請する"
                    : mode === "invite-activate"
                      ? "グループに参加する"
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

        {forcePasskeyRegister ? (
          /* --- パスキー強制登録モード（ログイン直後・未登録の場合） --- */
          <div>
            {passkeyRegPhase === "idle" && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    margin: "8px 0 20px",
                    color: "var(--text-secondary)",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  <p style={{ margin: "0 0 8px" }}>
                    セキュリティのため、このデバイスにパスキー（指紋・顔認証）を登録してください。
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                    登録後は次回から生体認証でログインできます。
                  </p>
                </div>
                <div style={{ margin: "28px 0", display: "flex", justifyContent: "center" }}>
                  <Fingerprint size={64} color="#6366f1" strokeWidth={1.2} />
                </div>
                {errorMessage && <ErrorBanner message={errorMessage} />}
                <button
                  onClick={handleForcePasskeyBegin}
                  style={{ ...primaryBtnStyle(false), flex: "unset", width: "100%" }}
                >
                  <Fingerprint size={15} />
                  設定する
                </button>
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <button onClick={handleLogout} style={smallLinkBtnStyle}>
                    ログアウトする
                  </button>
                </div>
              </div>
            )}
            {passkeyRegPhase === "creating" && (
              <div
                style={{
                  padding: "40px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Loader2
                  size={40}
                  color="#6366f1"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
                <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
                  生体認証を完了してください...
                </p>
              </div>
            )}
            {passkeyRegPhase === "naming" && (
              <div>
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  このデバイスの名前を設定してください。
                </p>
                <input
                  type="text"
                  value={passkeyRegDeviceName}
                  onChange={(e) => setPasskeyRegDeviceName(e.target.value)}
                  placeholder="iPhone / Mac など"
                  style={inputStyle}
                />
                {errorMessage && <ErrorBanner message={errorMessage} />}
                <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                  <button
                    onClick={() => {
                      setPasskeyRegPhase("idle");
                      setPasskeyRegCredential(null);
                      setErrorMessage(null);
                    }}
                    style={secondaryBtnStyle}
                  >
                    やり直す
                  </button>
                  <button
                    onClick={handleForcePasskeyComplete}
                    disabled={!passkeyRegDeviceName}
                    style={primaryBtnStyle(!passkeyRegDeviceName)}
                  >
                    保存する
                  </button>
                </div>
              </div>
            )}
            {passkeyRegPhase === "saving" && (
              <div
                style={{
                  padding: "40px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Loader2
                  size={40}
                  color="#6366f1"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
                <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>保存中...</p>
              </div>
            )}
          </div>
        ) : mode === "passkey" ? (
          /* --- パスキー認証モード --- */
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                margin: "8px 0 20px",
                color: "var(--text-secondary)",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              <p style={{ margin: "0 0 8px" }}>
                登録済みのパスキー（指紋・顔認証）で本人確認を行います。
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                ログインにはデバイスの生体認証が必要です。
              </p>
            </div>
            <div style={{ margin: "28px 0", display: "flex", justifyContent: "center" }}>
              <Fingerprint size={64} color="#6366f1" strokeWidth={1.2} />
            </div>
            {errorMessage && <ErrorBanner message={errorMessage} />}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button
                onClick={() => {
                  setPasskeyMode(false);
                  setPasskeyData(null);
                  setErrorMessage(null);
                }}
                disabled={isLoading}
                style={secondaryBtnStyle}
              >
                戻る
              </button>
              <button
                onClick={handlePasskeyVerify}
                disabled={isLoading}
                style={primaryBtnStyle(isLoading)}
              >
                {isLoading ? (
                  <LoadingContent label="認証中..." />
                ) : (
                  <>
                    <Fingerprint size={15} />
                    認証する
                  </>
                )}
              </button>
            </div>
          </div>
        ) : mode === "reenter" ? (
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
        ) : mode === "invite-activate" ? (
          /* --- 招待経由アカウント有効化モード --- */
          <div>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              グループへの招待を受けました。パスフレーズを設定してアカウントを有効化してください。
              パスフレーズはデータの暗号化に使用するため、忘れた場合は復元できません。
            </p>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>メールアドレス</label>
              <input
                type="email"
                value={inviteEmail ?? ""}
                disabled
                style={{ ...inputStyle, opacity: 0.6 }}
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
            <button
              onClick={handleActivateInviteSubmit}
              disabled={isLoading || !passphrase || passphrase !== passphraseConfirm}
              style={{
                ...primaryBtnStyle(isLoading || !passphrase || passphrase !== passphraseConfirm),
                width: "100%",
                marginTop: 20,
              }}
            >
              {isLoading ? <LoadingContent label="設定中..." /> : "グループに参加する"}
            </button>
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

// --- パスキー WebAuthn ヘルパー ---

function base64UrlToArrayBuffer(s: string): ArrayBuffer {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const b64 = pad === 0 ? padded : padded + "====".slice(pad);
  const raw = atob(b64);
  const buf = new ArrayBuffer(raw.length);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return buf;
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getPasskeyAssertion(
  challenge: string,
  credentialIds: string[]
): Promise<AuthenticationResponseJSON> {
  const credential = (await navigator.credentials.get({
    publicKey: {
      challenge: base64UrlToArrayBuffer(challenge),
      allowCredentials: credentialIds.map((id) => ({
        id: base64UrlToArrayBuffer(id),
        type: "public-key" as const,
      })),
      userVerification: "preferred",
      timeout: 60000,
    },
  })) as PublicKeyCredential | null;

  if (!credential) throw new Error("認証がキャンセルされました");

  // PublicKeyCredential を JSON 形式にシリアライズ
  if (typeof credential.toJSON === "function") {
    return credential.toJSON() as AuthenticationResponseJSON;
  }
  const resp = credential.response as AuthenticatorAssertionResponse;
  return {
    id: credential.id,
    rawId: uint8ArrayToBase64Url(new Uint8Array(credential.rawId)),
    response: {
      clientDataJSON: uint8ArrayToBase64Url(new Uint8Array(resp.clientDataJSON)),
      authenticatorData: uint8ArrayToBase64Url(new Uint8Array(resp.authenticatorData)),
      signature: uint8ArrayToBase64Url(new Uint8Array(resp.signature)),
      userHandle: resp.userHandle
        ? uint8ArrayToBase64Url(new Uint8Array(resp.userHandle))
        : undefined,
    },
    type: "public-key",
    clientExtensionResults: credential.getClientExtensionResults() as Record<string, unknown>,
  };
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

const smallLinkBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--text-muted)",
  fontSize: 12,
  cursor: "pointer",
  textDecoration: "underline",
};

// --- パスキー登録 WebAuthn ヘルパー ---

async function createPasskeyCredential(
  options: PublicKeyCredentialCreationOptionsJSON
): Promise<RegistrationResponseJSON> {
  const credential = (await navigator.credentials.create({
    publicKey: {
      ...options,
      challenge: base64UrlToArrayBuffer(options.challenge),
      user: {
        ...options.user,
        id: base64UrlToArrayBuffer(options.user.id),
      },
      excludeCredentials: options.excludeCredentials?.map((c) => ({
        id: base64UrlToArrayBuffer(c.id),
        type: "public-key" as const,
      })),
    },
  })) as PublicKeyCredential | null;

  if (!credential) throw new Error("パスキーの作成がキャンセルされました");

  if (typeof credential.toJSON === "function") {
    return credential.toJSON() as RegistrationResponseJSON;
  }
  const resp = credential.response as AuthenticatorAttestationResponse;
  return {
    id: credential.id,
    rawId: uint8ArrayToBase64Url(new Uint8Array(credential.rawId)),
    response: {
      clientDataJSON: uint8ArrayToBase64Url(new Uint8Array(resp.clientDataJSON)),
      attestationObject: uint8ArrayToBase64Url(new Uint8Array(resp.attestationObject)),
      transports: (resp.getTransports?.() ?? []) as AuthenticatorTransportFuture[],
    },
    type: "public-key",
    clientExtensionResults: credential.getClientExtensionResults() as Record<string, unknown>,
  };
}

function getDefaultDeviceName(): string {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return "Android";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows PC";
  return "デバイス";
}
