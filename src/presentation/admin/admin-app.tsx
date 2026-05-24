import { useState, useEffect } from "react";
import { authService } from "@infrastructure/sync/auth-service";
import { cloudflareSyncRepository } from "@infrastructure/sync/cloudflare-sync-repository";
import { UserListTable } from "./user-list-table";
import { RegistrationRequestsTable } from "./registration-requests-table";

type AdminState = "checking" | "login" | "unauthorized" | "ready";

export function AdminApp() {
  const [adminState, setAdminState] = useState<AdminState>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authService.isLoggedIn()) {
      const role = authService.getRole();
      setAdminState(role === "admin" ? "ready" : "unauthorized");
    } else {
      setAdminState("login");
    }
  }, []);

  const handleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      // パスフレーズをSHA-256ハッシュ化（sync-setup-sheetと同じ方式）
      const enc = new TextEncoder();
      const hashBuf = await crypto.subtle.digest("SHA-256", enc.encode(password));
      const bytes = new Uint8Array(hashBuf);
      let binary = "";
      for (const b of bytes) binary += String.fromCharCode(b);
      const passwordHash = btoa(binary);

      const result = await cloudflareSyncRepository.login(email, passwordHash);
      authService.saveTokens(result.accessToken, result.refreshToken);
      authService.saveEmail(email);
      authService.saveSalt(result.salt);

      if (result.role !== "admin") {
        authService.clearAll();
        setAdminState("unauthorized");
        return;
      }

      setAdminState("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    const rt = authService.getRefreshToken();
    if (rt) cloudflareSyncRepository.logout(rt).catch(() => {});
    authService.clearAll();
    setAdminState("login");
    setEmail("");
    setPassword("");
  };

  if (adminState === "checking") {
    return <CenteredMessage message="確認中…" />;
  }

  if (adminState === "unauthorized") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>アクセス権限がありません</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
            管理者アカウントでログインしてください。
          </p>
          <button onClick={handleLogout} style={secondaryBtnStyle}>
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  if (adminState === "login") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>管理画面ログイン</h2>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="admin@example.com"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>パスフレーズ</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSubmitting && void handleLogin()}
              disabled={isSubmitting}
              placeholder="パスフレーズを入力"
              style={inputStyle}
            />
          </div>
          {error && <div style={errorStyle}>{error}</div>}
          <button
            onClick={() => void handleLogin()}
            disabled={isSubmitting || !email || !password}
            style={primaryBtnStyle(isSubmitting || !email || !password)}
          >
            {isSubmitting ? "ログイン中…" : "ログイン"}
          </button>
        </div>
      </div>
    );
  }

  // ready
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>kodawarimap</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              background: "#6366f1",
              color: "#fff",
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            Admin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{authService.getEmail()}</span>
          <button onClick={handleLogout} style={secondaryBtnStyle}>
            ログアウト
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
        <section style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
            登録申請
          </h1>
          <RegistrationRequestsTable />
        </section>
        <section>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
            ユーザー管理
          </h1>
          <UserListTable />
        </section>
      </main>
    </div>
  );
}

function CenteredMessage({ message }: { message: string }) {
  return <div style={{ ...containerStyle, color: "#6b7280", fontSize: 14 }}>{message}</div>;
}

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f9fafb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: "32px 28px",
  width: "100%",
  maxWidth: 400,
  boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
};

const headingStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: "#111827",
  marginBottom: 20,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const errorStyle: React.CSSProperties = {
  padding: "10px 12px",
  background: "#fef2f2",
  border: "1px solid #fca5a5",
  borderRadius: 6,
  color: "#dc2626",
  fontSize: 13,
  marginBottom: 12,
};

function primaryBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "12px 0",
    border: "none",
    borderRadius: 8,
    background: disabled ? "#e5e7eb" : "#6366f1",
    color: disabled ? "#9ca3af" : "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

const secondaryBtnStyle: React.CSSProperties = {
  padding: "8px 16px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  background: "#fff",
  color: "#374151",
  fontSize: 13,
  cursor: "pointer",
};
