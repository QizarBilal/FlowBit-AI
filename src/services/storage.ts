import { AreaOfInterest, ViewportState } from '../types';

const keys = {
  features: 'aois',
  viewport: 'mapState',
  layers: 'layerVisibility',
};

function safeWrite(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('localStorage write failed:', key);
    // probably quota exceeded but whatever
  }
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveFeatures(features: AreaOfInterest[]): void {
  safeWrite(keys.features, features);
}

export function loadFeatures(): AreaOfInterest[] {
  return safeRead<AreaOfInterest[]>(keys.features, []);
}

export function clearFeatures(): void {
  try {
    localStorage.removeItem(keys.features);
  } catch {}
}

export function saveViewport(state: ViewportState): void {
  safeWrite(keys.viewport, state);
}

export function loadViewport(): ViewportState | null {
  return safeRead<ViewportState | null>(keys.viewport, null);
}

export function saveLayerPrefs(satellite: boolean, features: boolean): void {
  safeWrite(keys.layers, { satellite, features });
}

export function loadLayerPrefs(): {
  satellite: boolean;
  features: boolean;
} | null {
  return safeRead<{ satellite: boolean; features: boolean } | null>(
    keys.layers,
    null
  );
}
