import { useState, useEffect, useCallback } from "react";
import { adminApiClient, type AdminUser } from "@infrastructure/admin/admin-api-client";

const LIMIT = 50;

export function UserListTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async (q: string, off: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminApiClient.listUsers(q, LIMIT, off);
      setUsers(result.users);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers(query, offset);
  }, [query, offset, fetchUsers]);

  const handleSearch = () => {
    setQuery(inputValue);
    setOffset(0);
  };

  const handleTogglePlan = async (user: AdminUser) => {
    const newPlan = user.plan === "free" ? "pro" : "free";
    if (newPlan === "free" && !confirm(`${user.email} を Free に降格しますか？`)) return;
    setUpdatingId(user.id);
    try {
      await adminApiClient.updateUserPlan(user.id, newPlan);
      await fetchUsers(query, offset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSetFamily = async (user: AdminUser) => {
    if (!confirm(`${user.email} を Family プランに設定しますか？`)) return;
    setUpdatingId(user.id);
    try {
      await adminApiClient.updateUserPlan(user.id, "family");
      await fetchUsers(query, offset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div>
      {/* 検索バー */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="メールアドレスで検索"
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          検索
        </button>
        {query && (
          <button
            onClick={() => {
              setInputValue("");
              setQuery("");
              setOffset(0);
            }}
            style={{
              padding: "8px 12px",
              background: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            クリア
          </button>
        )}
      </div>

      {/* 件数表示 */}
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
        {isLoading
          ? "読み込み中…"
          : `${total} 件中 ${offset + 1}〜${Math.min(offset + LIMIT, total)} 件を表示`}
      </p>

      {error && (
        <div
          style={{
            padding: "10px 12px",
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: 6,
            color: "#dc2626",
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {/* テーブル */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              {["メールアドレス", "プラン", "ロール", "登録日", "操作"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#374151",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "10px 12px", color: "#111827", wordBreak: "break-all" }}>
                  {user.email}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      background:
                        user.plan === "family"
                          ? "#8b5cf6"
                          : user.plan === "pro"
                            ? "#6366f1"
                            : "#e5e7eb",
                      color: user.plan === "free" ? "#374151" : "#fff",
                    }}
                  >
                    {user.plan === "family" ? "Family" : user.plan === "pro" ? "Pro" : "Free"}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", color: "#6b7280" }}>{user.role}</td>
                <td style={{ padding: "10px 12px", color: "#6b7280", whiteSpace: "nowrap" }}>
                  {formatDate(user.createdAt)}
                </td>
                <td style={{ padding: "10px 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {user.plan !== "family" && (
                    <button
                      onClick={() => void handleSetFamily(user)}
                      disabled={updatingId === user.id}
                      style={{
                        padding: "4px 10px",
                        border: "none",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: updatingId === user.id ? "not-allowed" : "pointer",
                        background: updatingId === user.id ? "#e5e7eb" : "#8b5cf6",
                        color: updatingId === user.id ? "#9ca3af" : "#fff",
                        opacity: updatingId === user.id ? 0.6 : 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Familyに昇格
                    </button>
                  )}
                  <button
                    onClick={() => void handleTogglePlan(user)}
                    disabled={updatingId === user.id}
                    style={{
                      padding: "4px 10px",
                      border: "none",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: updatingId === user.id ? "not-allowed" : "pointer",
                      background:
                        updatingId === user.id
                          ? "#e5e7eb"
                          : user.plan !== "free"
                            ? "#ef4444"
                            : "#6366f1",
                      color: updatingId === user.id ? "#9ca3af" : "#fff",
                      opacity: updatingId === user.id ? 0.6 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {updatingId === user.id
                      ? "更新中…"
                      : user.plan !== "free"
                        ? "Freeに降格"
                        : "Proに昇格"}
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "24px 12px", textAlign: "center", color: "#9ca3af" }}
                >
                  ユーザーが見つかりません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ページング */}
      {total > LIMIT && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
          <button
            onClick={() => setOffset(Math.max(0, offset - LIMIT))}
            disabled={offset === 0}
            style={pageBtnStyle(offset === 0)}
          >
            ← 前
          </button>
          <button
            onClick={() => setOffset(offset + LIMIT)}
            disabled={offset + LIMIT >= total}
            style={pageBtnStyle(offset + LIMIT >= total)}
          >
            次 →
          </button>
        </div>
      )}
    </div>
  );
}

function pageBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "6px 16px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: disabled ? "#f3f4f6" : "#fff",
    color: disabled ? "#9ca3af" : "#374151",
    fontSize: 14,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
