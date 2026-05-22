import type { FeatureCollection } from "geojson";

type Bbox = { west: number; south: number; east: number; north: number };

type OsmNode = {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
};

type OverpassResponse = {
  elements: OsmNode[];
};

function resolveCategoryId(tags: Record<string, string>): string {
  if (tags["natural"] === "peak" || tags["tourism"] === "alpine_hut") return "hiking";
  if (tags["tourism"] === "viewpoint") return "hiking";
  if (
    tags["amenity"] === "place_of_worship" &&
    (tags["religion"] === "shinto" || tags["religion"] === "buddhist")
  )
    return "shrine_temple";
  if (tags["tourism"] === "theme_park" || tags["leisure"] === "water_park") return "theme_park";
  if (tags["tourism"] === "camp_site") return "camping";
  if (tags["amenity"] === "bath_house" || tags["natural"] === "hot_spring") return "onsen";
  if (tags["natural"] === "beach" || tags["leisure"] === "beach_resort") return "beach";
  if (tags["leisure"] === "nature_reserve") return "nature";
  if (tags["shop"] === "department_store" || tags["shop"] === "mall") return "shopping";
  if (tags["tourism"] === "museum") return "travel";
  if (tags["leisure"] === "fishing") return "fishing";
  if (tags["tourism"] === "attraction") return "travel";
  if ("historic" in tags) return "travel";
  return "travel";
}

export async function fetchPoiFromOverpass(bbox: Bbox): Promise<FeatureCollection["features"]> {
  const { south: S, west: W, north: N, east: E } = bbox;
  const query = `[out:json][timeout:60];
(
  node["tourism"="attraction"]["name"](${S},${W},${N},${E});
  node["historic"~"castle|ruins|archaeological_site"]["name"](${S},${W},${N},${E});
  node["natural"="peak"]["name"](${S},${W},${N},${E});
  node["tourism"="viewpoint"]["name"](${S},${W},${N},${E});
  node["tourism"="alpine_hut"]["name"](${S},${W},${N},${E});
  node["leisure"="fishing"]["name"](${S},${W},${N},${E});
  node["tourism"="museum"]["name"](${S},${W},${N},${E});
  node["tourism"="theme_park"]["name"](${S},${W},${N},${E});
  node["leisure"="water_park"]["name"](${S},${W},${N},${E});
  node["amenity"="place_of_worship"]["religion"="shinto"]["name"](${S},${W},${N},${E});
  node["amenity"="place_of_worship"]["religion"="buddhist"]["name"](${S},${W},${N},${E});
  node["tourism"="camp_site"]["name"](${S},${W},${N},${E});
  node["amenity"="bath_house"]["name"](${S},${W},${N},${E});
  node["natural"="hot_spring"]["name"](${S},${W},${N},${E});
  node["natural"="beach"]["name"](${S},${W},${N},${E});
  node["leisure"="beach_resort"]["name"](${S},${W},${N},${E});
  node["leisure"="nature_reserve"]["name"](${S},${W},${N},${E});
  node["shop"~"department_store|mall"]["name"](${S},${W},${N},${E});
);
out body;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  if (!res.ok) throw new Error(`Overpass fetch failed: ${res.status}`);
  const data = (await res.json()) as OverpassResponse;

  return data.elements.map((node) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [node.lon, node.lat] as [number, number],
    },
    properties: {
      name: node.tags["name"] ?? node.tags["name:ja"] ?? "",
      categoryId: resolveCategoryId(node.tags),
    },
  }));
}
