import { useState, useEffect, useCallback } from "react";
import { adminApiClient, type RegistrationRequest } from "@infrastructure/admin/admin-api-client";

export function RegistrationRequestsTable() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminApiClient.listRegistrationRequests();
      setRequests(result.requests);
    } catch (err) {
      setError(err instanceof Error ? err.message : "取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await adminApiClient.approveRegistration(id);
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "承認に失敗しました");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("この申請を拒否しますか？")) return;
    setProcessingId(id);
    try {
      await adminApiClient.rejectRegistration(id);
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "拒否に失敗しました");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div>
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

      {isLoading ? (
        <p style={{ fontSize: 13, color: "#6b7280" }}>読み込み中…</p>
      ) : requests.length === 0 ? (
        <p style={{ fontSize: 13, color: "#9ca3af" }}>現在の申請はありません</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                {["メールアドレス", "申請日時", "操作"].map((h) => (
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
              {requests.map((req) => (
                <tr key={req.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 12px", color: "#111827", wordBreak: "break-all" }}>
                    {req.email}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#6b7280", whiteSpace: "nowrap" }}>
                    {formatDate(req.requestedAt)}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => void handleApprove(req.id)}
                        disabled={processingId === req.id}
                        style={{
                          padding: "4px 12px",
                          border: "none",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: processingId === req.id ? "not-allowed" : "pointer",
                          background: processingId === req.id ? "#e5e7eb" : "#6366f1",
                          color: processingId === req.id ? "#9ca3af" : "#fff",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {processingId === req.id ? "処理中…" : "承認"}
                      </button>
                      <button
                        onClick={() => void handleReject(req.id)}
                        disabled={processingId === req.id}
                        style={{
                          padding: "4px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: processingId === req.id ? "not-allowed" : "pointer",
                          background: "#fff",
                          color: "#374151",
                          whiteSpace: "nowrap",
                        }}
                      >
                        拒否
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
