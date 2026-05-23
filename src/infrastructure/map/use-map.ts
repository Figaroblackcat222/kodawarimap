import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { DEFAULT_CATEGORY } from "@domain/entities/category";
import { isProtomapsTheme, parseProtomapsTheme, getProtomapsStyle } from "./protomaps-style";

const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const DEFAULT_CENTER: [number, number] = [139.6917, 35.6895]; // Tokyo
const DEFAULT_ZOOM = 10;

export function useMap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onMapClick: (lng: number, lat: number) => void,
  styleUrl: string = DEFAULT_CATEGORY.styleUrl,
  getBottomPadding?: () => number
) {
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const resolvedStyle = isProtomapsTheme(styleUrl)
      ? getProtomapsStyle(parseProtomapsTheme(styleUrl))
      : styleUrl;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: resolvedStyle,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");
    map.doubleClickZoom.disable();

    let clickTimer: ReturnType<typeof setTimeout> | null = null;

    map.on("click", (e) => {
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickTimer = null;
        map.flyTo({ center: e.lngLat, zoom: 16, padding: { bottom: getBottomPadding?.() ?? 0 } });
      }, 250);
    });

    map.on("dblclick", (e) => {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      onMapClick(e.lngLat.lng, e.lngLat.lat);
    });

    mapRef.current = map;

    return () => {
      if (clickTimer) clearTimeout(clickTimer);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スタイル切り替え
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const resolvedStyle = isProtomapsTheme(styleUrl)
      ? getProtomapsStyle(parseProtomapsTheme(styleUrl))
      : styleUrl;
    map.setStyle(resolvedStyle);
  }, [styleUrl]);

  return mapRef;
}
