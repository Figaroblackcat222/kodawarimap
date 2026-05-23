import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import type maplibregl from "maplibre-gl";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

interface Props {
  map: maplibregl.Map | null;
}

export function GeocoderSearch({ map }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=ja`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "ja" },
      });
      if (!res.ok) return;
      const data: NominatimResult[] = await res.json();
      setResults(data);
    } catch {
      // ネットワークエラーは無視
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 400);
  };

  const handleSelect = (result: NominatimResult) => {
    if (!map) return;
    map.flyTo({
      center: [parseFloat(result.lon), parseFloat(result.lat)],
      zoom: 14,
    });
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "absolute",
          top: 48,
          right: 52,
          zIndex: 10,
          background: "var(--bg-primary)",
          border: "none",
          borderRadius: 8,
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px var(--shadow)",
        }}
        title="地名・ランドマーク検索"
      >
        <Search size={18} color="var(--text-secondary)" />
      </button>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 48,
        left: 50,
        right: 52,
        zIndex: 20,
      }}
    >
      <div
        style={{
          background: "var(--bg-primary)",
          borderRadius: 10,
          boxShadow: "0 4px 16px var(--shadow)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "6px 10px", gap: 8 }}>
          {loading ? (
            <Loader2 size={16} color="var(--text-secondary)" className="spin" />
          ) : (
            <Search size={16} color="var(--text-secondary)" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder="地名・ランドマークを検索"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: 14,
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              display: "flex",
              alignItems: "center",
              color: "var(--text-secondary)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {results.length > 0 && (
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {results.map((r) => (
              <button
                key={r.place_id}
                onClick={() => handleSelect(r)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--bg-primary)",
                  cursor: "pointer",
                  fontSize: 13,
                  color: "var(--text-primary)",
                  lineHeight: 1.4,
                }}
              >
                {r.display_name}
              </button>
            ))}
            <div
              style={{
                padding: "4px 12px",
                fontSize: 10,
                color: "var(--text-secondary)",
                textAlign: "right",
              }}
            >
              © OpenStreetMap contributors
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
