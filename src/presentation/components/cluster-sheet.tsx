import { useState, useEffect } from "react";
import type { Pin } from "@domain/entities/pin";
import type { PhotoRepository } from "@application/ports/photo-repository";

interface Props {
  pins: Pin[];
  photoRepo: PhotoRepository;
  onPinDetail: (pin: Pin) => void;
  onClose: () => void;
}

function PinThumb({ pinId, photoRepo }: { pinId: string; photoRepo: PhotoRepository }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    photoRepo.findByPinId(pinId).then((photos) => {
      if (!cancelled && photos.length > 0) {
        objectUrl = URL.createObjectURL(photos[0].blob);
        setUrl(objectUrl);
      }
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pinId, photoRepo]);

  if (!url) return null;
  return (
    <img
      src={url}
      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
    />
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

export function ClusterSheet({ pins, photoRepo, onPinDetail, onClose }: Props) {
  const sorted = [...pins].sort((a, b) => {
    const da = a.exif?.takenAt ?? a.createdAt;
    const db = b.exif?.takenAt ?? b.createdAt;
    return db.getTime() - da.getTime();
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--bg-primary)",
          borderRadius: "16px 16px 0 0",
          padding: "20px 16px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
            この場所の記録（{pins.length}件）
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "var(--text-secondary)",
              padding: "4px 8px",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((pin) => {
            const date = pin.exif?.takenAt ?? pin.createdAt;
            return (
              <button
                key={pin.id}
                onClick={() => onPinDetail(pin)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  background: "var(--bg-secondary)",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <PinThumb pinId={pin.id} photoRepo={photoRepo} />
                <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "var(--text-primary)",
                    }}
                  >
                    {pin.title}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {formatDate(date)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
