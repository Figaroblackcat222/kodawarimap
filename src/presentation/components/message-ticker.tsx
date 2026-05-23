import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

export const TICKER_ENABLED_KEY = "kodawarimap:ticker-enabled";
export const TICKER_COLLAPSED_KEY = "kodawarimap:ticker-collapsed";

interface Props {
  message: string;
  label: string;
  onScrollEnd?: () => void;
}

export function MessageTicker({ message, label, onScrollEnd }: Props) {
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem(TICKER_ENABLED_KEY) !== "false"
  );
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(TICKER_COLLAPSED_KEY) === "true"
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [duration, setDuration] = useState(20);
  const [scrollEnd, setScrollEnd] = useState("0px");
  const [phase, setPhase] = useState<"static" | "scrolling">("static");

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === TICKER_ENABLED_KEY) setEnabled(e.newValue !== "false");
      if (e.key === TICKER_COLLAPSED_KEY) setCollapsed(e.newValue === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    const containerW = containerRef.current.offsetWidth;
    const textW = textRef.current.scrollWidth;
    const total = containerW + textW;
    const speed = 80;
    setScrollEnd(`-${total}px`);
    setDuration(Math.max(10, total / speed));
  }, [message]);

  // message が変わるたびに static に戻り、3秒後に scrolling へ
  useEffect(() => {
    setPhase("static");
    const timer = setTimeout(() => setPhase("scrolling"), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!enabled) return null;

  if (collapsed) {
    return (
      <button
        onClick={() => {
          setCollapsed(false);
          localStorage.setItem(TICKER_COLLAPSED_KEY, "false");
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 15,
          width: 36,
          height: 40,
          background: "rgba(26,26,46,0.88)",
          color: "#fff",
          border: "none",
          borderRadius: "0 0 8px 0",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="ガイドメッセージを表示"
      >
        <ChevronRight size={16} />
      </button>
    );
  }

  const handleCollapse = () => {
    setCollapsed(true);
    localStorage.setItem(TICKER_COLLAPSED_KEY, "true");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 15,
        background: "rgba(26,26,46,0.88)",
        color: "#fff",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        height: 40,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(var(--ticker-scroll-end)); }
        }
      `}</style>
      <span
        style={{
          flexShrink: 0,
          padding: "0 10px",
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: "nowrap",
          borderRight: "1px solid rgba(255,255,255,0.25)",
          lineHeight: "40px",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </span>
      <div
        ref={containerRef}
        style={{ flex: 1, overflow: "hidden", position: "relative", height: "100%" }}
      >
        <span
          ref={textRef}
          onAnimationEnd={onScrollEnd}
          style={
            {
              display: "inline-block",
              whiteSpace: "nowrap",
              lineHeight: "40px",
              paddingLeft: phase === "static" ? "12px" : "0",
              animation:
                phase === "scrolling" ? `ticker-scroll ${duration}s linear forwards` : "none",
              "--ticker-scroll-end": scrollEnd,
            } as React.CSSProperties
          }
        >
          {message}
        </span>
      </div>
      <button
        onClick={handleCollapse}
        style={{
          flexShrink: 0,
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          opacity: 0.7,
          fontSize: 16,
          lineHeight: 1,
        }}
        title="閉じる"
      >
        ×
      </button>
    </div>
  );
}
