/**
 * 同期ステータスインジケーター
 *
 * 地図右上（設定ボタンの左隣）に配置する 32x32px の小さなインジケーター。
 * SyncState に応じてアイコンを切り替える。
 */
import { Check, WifiOff, AlertTriangle, Loader2 } from "lucide-react";
import type { SyncState } from "@presentation/hooks/use-sync";

interface SyncStatusIndicatorProps {
  syncState: SyncState;
  onRetry: () => void;
}

export function SyncStatusIndicator({ syncState, onRetry }: SyncStatusIndicatorProps) {
  // unauthenticated の場合は非表示（設定シートで対応）
  if (syncState === "unauthenticated") return null;

  const handleClick = () => {
    if (syncState === "error") {
      onRetry();
    }
  };

  return (
    <button
      onClick={handleClick}
      title={stateLabel(syncState)}
      style={{
        position: "absolute",
        top: 92,
        right: 8,
        zIndex: 10,
        width: 36,
        height: 36,
        border: "none",
        borderRadius: 8,
        background: "var(--bg-primary)",
        boxShadow: "0 2px 8px var(--shadow)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: syncState === "error" ? "pointer" : "default",
        opacity: 0.9,
      }}
    >
      <StatusIcon state={syncState} />
    </button>
  );
}

function StatusIcon({ state }: { state: SyncState }) {
  switch (state) {
    case "idle":
      return <Check size={16} color="#22c55e" strokeWidth={2.5} />;
    case "syncing":
      return (
        <Loader2 size={16} color="#6366f1" style={{ animation: "spin 0.8s linear infinite" }} />
      );
    case "error":
      return <AlertTriangle size={16} color="#f97316" strokeWidth={2.5} />;
    case "offline":
      return <WifiOff size={16} color="#9ca3af" strokeWidth={2} />;
    default:
      return null;
  }
}

function stateLabel(state: SyncState): string {
  switch (state) {
    case "idle":
      return "同期済み";
    case "syncing":
      return "同期中...";
    case "error":
      return "同期エラー（タップして再試行）";
    case "offline":
      return "オフライン";
    default:
      return "";
  }
}
