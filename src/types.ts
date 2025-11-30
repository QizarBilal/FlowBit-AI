export type FeatureKind = 'point' | 'line' | 'polygon' | 'rectangle' | 'circle';

export interface AreaOfInterest {
  id: string;
  name: string;
  description: string;
  type: FeatureKind;
  coordinates: number[][] | number[][][];
  radius?: number;
  color: string;
  createdAt: string;
  updatedAt: string;
  geoJSON?: GeoJSON.Feature;
}

export interface ViewportState {
  center: [number, number];
  zoom: number;
}

export interface WorkspaceState {
  features: AreaOfInterest[];
  activeFeatureId: string | null;
  activeTool: FeatureKind | null;
  isEditMode: boolean;
  showSatellite: boolean;
  showFeatures: boolean;
  searchQuery: string;
  undoStack: AreaOfInterest[][];
  redoStack: AreaOfInterest[][];
  viewport: ViewportState;
}

// for nominatim search results
export interface SearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
}
