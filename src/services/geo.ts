import { FeatureKind } from '../types';
// import L from 'leaflet'; // might need this later for more complex geo stuff

// converts our coordinate format to proper GeoJSON
// (swaps lat/lng to lng/lat because GeoJSON is weird)
export function toGeoJSON(
  kind: FeatureKind,
  coords: number[][] | number[][][],
  radiusMeters?: number
): GeoJSON.Feature {
  if (kind === 'point') {
    const [lat, lng] = coords[0] as number[];
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    };
  }

  if (kind === 'line') {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: (coords as number[][]).map(([lat, lng]) => [lng, lat]),
      },
    };
  }

  if (kind === 'circle' && radiusMeters) {
    const [lat, lng] = coords[0] as number[];
    return {
      type: 'Feature',
      properties: { radius: radiusMeters },
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    };
  }

  // polygon or rectangle
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [(coords[0] as number[][]).map(([lat, lng]) => [lng, lat])],
    },
  };
}

// parse GeoJSON back to our format
export function fromGeoJSON(feature: GeoJSON.Feature): {
  kind: FeatureKind;
  coords: number[][] | number[][][];
  radiusMeters?: number;
} | null {
  const { geometry, properties } = feature;

  if (geometry.type === 'Point') {
    const [lng, lat] = geometry.coordinates;
    const radiusMeters = properties?.radius;
    return {
      kind: radiusMeters ? 'circle' : 'point',
      coords: [[lat, lng]],
      radiusMeters,
    };
  }

  if (geometry.type === 'LineString') {
    return {
      kind: 'line',
      coords: geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    };
  }

  if (geometry.type === 'Polygon') {
    return {
      kind: 'polygon',
      coords: [geometry.coordinates[0].map(([lng, lat]) => [lat, lng])],
    };
  }

  return null;
}

// simplify polygon coordinates using Douglas-Peucker algorithm
// currently disabled - can't find a tolerance that works at all zoom levels
// tried for like an hour, gave up
export function simplifyCoords(
  coords: number[][],
  tolerance: number = 0.0001
): number[][] {
  if (coords.length <= 2) return coords;

  // 0.0001 works at zoom 13 but looks awful zoomed in
  // TODO: maybe make tolerance dynamic based on current zoom?

  const perpendicularDistance = (
    point: number[],
    lineStart: number[],
    lineEnd: number[]
  ): number => {
    const [x0, y0] = point;
    const [x1, y1] = lineStart;
    const [x2, y2] = lineEnd;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const mag = Math.sqrt(dx * dx + dy * dy);

    if (mag === 0) return Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2);

    const u = ((x0 - x1) * dx + (y0 - y1) * dy) / (mag * mag);
    const ix = x1 + u * dx;
    const iy = y1 + u * dy;

    return Math.sqrt((x0 - ix) ** 2 + (y0 - iy) ** 2);
  };

  const simplify = (coords: number[][], tolerance: number): number[][] => {
    if (coords.length <= 2) return coords;

    let maxDist = 0;
    let maxIndex = 0;
    const start = coords[0];
    const end = coords[coords.length - 1];

    for (let i = 1; i < coords.length - 1; i++) {
      const dist = perpendicularDistance(coords[i], start, end);
      if (dist > maxDist) {
        maxDist = dist;
        maxIndex = i;
      }
    }

    if (maxDist < tolerance) {
      return [start, end];
    }

    const left = simplify(coords.slice(0, maxIndex + 1), tolerance);
    const right = simplify(coords.slice(maxIndex), tolerance);

    return [...left.slice(0, -1), ...right];
  };

  return simplify(coords, tolerance);
}

// calculate area of a polygon in square meters
export function calcArea(coords: number[][]): number {
  if (coords.length < 3) return 0;

  let area = 0;
  const R = 6371000; // earth radius in meters

  for (let i = 0; i < coords.length; i++) {
    const [lat1, lng1] = coords[i];
    const [lat2, lng2] = coords[(i + 1) % coords.length];

    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lng1Rad = (lng1 * Math.PI) / 180;
    const lng2Rad = (lng2 * Math.PI) / 180;

    area += (lng2Rad - lng1Rad) * (2 + Math.sin(lat1Rad) + Math.sin(lat2Rad));
  }

  area = (area * R * R) / 2;
  return Math.abs(area);
}

// check if we have too many features (performance warning)
// picked 100 arbitrarily, seems to work fine
export function tooManyPoints(count: number): boolean {
  return count > 100;
}

// unused but keeping for reference
// function calcDistance(p1: number[], p2: number[]): number {
//   const [lat1, lng1] = p1;
//   const [lat2, lng2] = p2;
//   const R = 6371000;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLng = ((lng2 - lng1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLng / 2) *
//       Math.sin(dLng / 2);
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }
