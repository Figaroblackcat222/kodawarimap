import { layers, LIGHT, DARK, GRAYSCALE } from "@protomaps/basemaps";
import type { StyleSpecification } from "maplibre-gl";

const PMTILES_URL = "pmtiles://https://pub-f197ab02699a4defbc70bf3a7dccdbb9.r2.dev/japan.pmtiles";

const ATTRIBUTION =
  '© <a href="https://openstreetmap.org">OpenStreetMap</a>, © <a href="https://protomaps.com">Protomaps</a>';

const SOURCE_NAME = "protomaps";

type ProtomapsTheme = "light" | "dark" | "grayscale";

function buildStyle(flavor: typeof LIGHT): StyleSpecification {
  return {
    version: 8,
    glyphs: "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
    sprite: "https://protomaps.github.io/basemaps-assets/sprites/v4/light/sprites",
    sources: {
      [SOURCE_NAME]: {
        type: "vector",
        url: PMTILES_URL,
        attribution: ATTRIBUTION,
      },
    },
    layers: layers(SOURCE_NAME, flavor, { lang: "ja" }),
  };
}

const STYLE_CACHE = new Map<ProtomapsTheme, StyleSpecification>();

export function getProtomapsStyle(theme: ProtomapsTheme): StyleSpecification {
  if (STYLE_CACHE.has(theme)) return STYLE_CACHE.get(theme)!;

  const flavor = theme === "dark" ? DARK : theme === "grayscale" ? GRAYSCALE : LIGHT;
  const style = buildStyle(flavor);
  STYLE_CACHE.set(theme, style);
  return style;
}

export function isProtomapsTheme(styleUrl: string): styleUrl is `protomaps:${ProtomapsTheme}` {
  return styleUrl.startsWith("protomaps:");
}

export function parseProtomapsTheme(styleUrl: string): ProtomapsTheme {
  const theme = styleUrl.replace("protomaps:", "") as ProtomapsTheme;
  if (theme !== "light" && theme !== "dark" && theme !== "grayscale") return "light";
  return theme;
}
