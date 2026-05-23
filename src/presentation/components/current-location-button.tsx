import { useState } from "react";
import { LocateFixed, Loader2 } from "lucide-react";

interface Props {
  onLocate: (lng: number, lat: number) => void;
  onError: (message: string) => void;
}

export function CurrentLocationButton({ onLocate, onError }: Props) {
  const [isLocating, setIsLocating] = useState(false);

  const handleClick = () => {
    if (!navigator.geolocation) {
      onError("このブラウザは位置情報に対応していません");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        onLocate(pos.coords.longitude, pos.coords.latitude);
      },
      () => {
        setIsLocating(false);
        onError("位置情報の取得に失敗しました。権限を確認してください。");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLocating}
      style={{
        position: "absolute",
        top: 160,
        left: 8,
        zIndex: 10,
        background: "#fff",
        border: "none",
        borderRadius: 8,
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isLocating ? "default" : "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        opacity: isLocating ? 0.7 : 1,
      }}
      title="現在地へ移動"
    >
      {isLocating ? (
        <Loader2 size={18} color="#555" className="spin" />
      ) : (
        <LocateFixed size={18} color="#555" />
      )}
    </button>
  );
}
