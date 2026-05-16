import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useMediaQuery } from "@presentation/hooks/use-media-query";

interface Props {
  onFile: (file: File) => void;
  loading?: boolean;
}

export function PhotoUploadButton({ onFile, loading = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => !loading && inputRef.current?.click()}
        disabled={loading}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          background: loading ? "#555" : "#1a1a2e",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 16px",
          fontSize: 14,
          cursor: loading ? "default" : "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "background 0.2s",
        }}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="spin" />
            {isDesktop && "変換中..."}
          </>
        ) : (
          <>
            <Camera size={16} />
            {isDesktop && "写真を追加"}
          </>
        )}
      </button>
    </>
  );
}
