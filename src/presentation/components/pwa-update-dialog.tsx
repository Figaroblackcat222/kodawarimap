import { useCallback, useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const DISMISS_KEY = "kodawarimap:pwa-dismiss-time";
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function isDismissed(): boolean {
  const t = localStorage.getItem(DISMISS_KEY);
  if (!t) return false;
  return Date.now() - Number(t) < TWO_HOURS_MS;
}

export function PwaUpdateDialog() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  const [needsUpdate] = needRefresh;
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkAndShow = useCallback(() => {
    if (needsUpdate && !isDismissed()) {
      setVisible(true);
    }
  }, [needsUpdate]);

  useEffect(() => {
    checkAndShow();
  }, [checkAndShow]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") checkAndShow();
    };
    document.addEventListener("visibilitychange", onVisibility);
    timerRef.current = setInterval(checkAndShow, TWO_HOURS_MS);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [checkAndShow]);

  if (!visible) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "var(--bg-primary)",
          borderRadius: 16,
          padding: "24px 20px",
          maxWidth: 360,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <h3
          style={{
            margin: "0 0 12px",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          新しいバージョンが利用可能です
        </h3>
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          アプリを最新状態に更新してください。入力中の内容は保存してから更新することをおすすめします。
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={handleDismiss}
            style={{
              padding: "8px 16px",
              border: "1px solid var(--border)",
              borderRadius: 8,
              background: "var(--bg-primary)",
              color: "var(--text-secondary)",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            後で
          </button>
          <button
            onClick={handleUpdate}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: 8,
              background: "#3b82f6",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            今すぐ更新
          </button>
        </div>
      </div>
    </div>
  );
}
