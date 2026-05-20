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
  if (tags["leisure"] === "park" || tags["leisure"] === "nature_reserve") return "nature";
  if (
    tags["amenity"] === "restaurant" ||
    tags["amenity"] === "cafe" ||
    tags["amenity"] === "fast_food"
  )
    return "food";
  if (
    tags["tourism"] === "museum" ||
    tags["tourism"] === "hotel" ||
    tags["tourism"] === "guest_house"
  )
    return "travel";
  if (tags["leisure"] === "fishing") return "fishing";
  if (tags["tourism"] === "attraction") return "travel";
  if ("historic" in tags) return "general";
  return "general";
}

export async function fetchPoiFromOverpass(bbox: Bbox): Promise<FeatureCollection["features"]> {
  const { south: S, west: W, north: N, east: E } = bbox;
  const query = `[out:json][timeout:60];
(
  node["tourism"="attraction"](${S},${W},${N},${E});
  node["historic"](${S},${W},${N},${E});
  node["amenity"="restaurant"](${S},${W},${N},${E});
  node["amenity"="cafe"](${S},${W},${N},${E});
  node["amenity"="fast_food"](${S},${W},${N},${E});
  node["natural"="peak"](${S},${W},${N},${E});
  node["tourism"="viewpoint"](${S},${W},${N},${E});
  node["tourism"="alpine_hut"](${S},${W},${N},${E});
  node["leisure"="fishing"](${S},${W},${N},${E});
  node["tourism"="museum"](${S},${W},${N},${E});
  node["tourism"="hotel"](${S},${W},${N},${E});
  node["tourism"="guest_house"](${S},${W},${N},${E});
  node["tourism"="theme_park"](${S},${W},${N},${E});
  node["leisure"="water_park"](${S},${W},${N},${E});
  node["amenity"="place_of_worship"]["religion"="shinto"](${S},${W},${N},${E});
  node["amenity"="place_of_worship"]["religion"="buddhist"](${S},${W},${N},${E});
  node["tourism"="camp_site"](${S},${W},${N},${E});
  node["amenity"="bath_house"](${S},${W},${N},${E});
  node["natural"="hot_spring"](${S},${W},${N},${E});
  node["natural"="beach"](${S},${W},${N},${E});
  node["leisure"="beach_resort"](${S},${W},${N},${E});
  node["leisure"="park"](${S},${W},${N},${E});
  node["leisure"="nature_reserve"](${S},${W},${N},${E});
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
