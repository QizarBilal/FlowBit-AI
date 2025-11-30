import React, {
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  Circle,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import { AreaOfInterest, FeatureKind } from '../../types';
import { SearchBar } from '../../components/SearchBar';
import { LayerControl } from '../../components/LayerControl';
import { MapControls } from '../../components/MapControls';
import { debounce } from '../../helpers';
import { tooManyPoints } from '../../services/geo';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  features: AreaOfInterest[];
  activeFeatureId: string | null;
  showSatellite: boolean;
  showFeatures: boolean;
  activeTool: FeatureKind | null;
  isEditMode: boolean;
  viewport: { center: [number, number]; zoom: number };
  onAddFeature: (
    kind: FeatureKind,
    coordinates: number[][] | number[][][],
    name?: string,
    radius?: number
  ) => void;
  onUpdateFeature: (id: string, updates: Partial<AreaOfInterest>) => void;
  onSelectFeature: (id: string | null) => void;
  onToggleSatellite: () => void;
  onToggleFeatures: () => void;
  onViewportChange: (center: [number, number], zoom: number) => void;
  onActivateTool: (tool: FeatureKind | null) => void;
}

const ViewportSync: React.FC<{
  center: [number, number];
  zoom: number;
  shouldAnimate: boolean;
}> = ({ center, zoom, shouldAnimate }) => {
  const map = useMap();

  useEffect(() => {
    if (shouldAnimate) {
      map.flyTo(center, zoom, { duration: 1.5 });
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, shouldAnimate, map]);

  return null;
};

const InteractionHandler: React.FC<{
  onViewportChange: (center: [number, number], zoom: number) => void;
  isDrawing: boolean;
}> = ({ onViewportChange, isDrawing }) => {
  const map = useMapEvents({
    moveend: debounce(() => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      requestAnimationFrame(() => {
        onViewportChange([center.lat, center.lng], zoom);
      });
    }, 300),
  });

  useEffect(() => {
    if (isDrawing) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    }
  }, [isDrawing, map]);

  return null;
};

const GeometryRenderer = React.memo<{
  feature: AreaOfInterest;
  isActive: boolean;
  onSelect: () => void;
}>(({ feature, isActive, onSelect }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const color = feature.color;
  const opacity = isActive ? 0.8 : isHovered ? 0.7 : 0.6;
  const weight = isActive ? 3 : isHovered ? 3 : 2;

  const handlers = useMemo(
    () => ({
      click: onSelect,
      mouseover: () => setIsHovered(true),
      mouseout: () => setIsHovered(false),
    }),
    [onSelect]
  );

  if (feature.type === 'point') {
    const [lat, lng] = feature.coordinates[0] as number[];
    return <Marker position={[lat, lng]} eventHandlers={handlers} />;
  }

  if (feature.type === 'line') {
    const positions = (feature.coordinates as number[][]).map(
      ([lat, lng]) => [lat, lng] as [number, number]
    );
    return (
      <Polyline
        positions={positions}
        color={color}
        opacity={opacity}
        weight={weight}
        eventHandlers={handlers}
      />
    );
  }

  if (feature.type === 'circle' && feature.radius) {
    const [lat, lng] = feature.coordinates[0] as number[];
    return (
      <Circle
        center={[lat, lng]}
        radius={feature.radius}
        color={color}
        fillColor={color}
        fillOpacity={opacity * 0.5}
        opacity={opacity}
        weight={weight}
        eventHandlers={handlers}
      />
    );
  }

  const positions = (feature.coordinates[0] as number[][]).map(
    ([lat, lng]) => [lat, lng] as [number, number]
  );
  return (
    <Polygon
      positions={positions}
      color={color}
      fillColor={color}
      fillOpacity={opacity * 0.5}
      opacity={opacity}
      weight={weight}
      eventHandlers={handlers}
    />
  );
});

GeometryRenderer.displayName = 'GeometryRenderer';

export const MapView: React.FC<MapViewProps> = ({
  features,
  activeFeatureId,
  showSatellite,
  showFeatures,
  activeTool,
  isEditMode,
  viewport,
  onAddFeature,
  onUpdateFeature,
  onSelectFeature,
  onToggleSatellite,
  onToggleFeatures,
  onViewportChange,
  onActivateTool,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const showOptimizationWarning = tooManyPoints(features.length);

  // activating drawing tools programmatically
  // this is kinda janky but leaflet-draw doesn't expose a proper API
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (activeTool) {
      setIsDrawing(true);

      const drawControl = (
        map as L.Map & {
          _toolbars?: {
            draw?: { _modes: Record<string, { handler: L.Handler }> };
          };
        }
      )._toolbars?.draw;

      if (drawControl) {
        const toolMap: Record<FeatureKind, string> = {
          point: 'marker',
          line: 'polyline',
          polygon: 'polygon',
          rectangle: 'rectangle',
          circle: 'circle',
        };

        const handlerKey = toolMap[activeTool];
        if (handlerKey && drawControl._modes[handlerKey]) {
          drawControl._modes[handlerKey].handler.enable();
        }
      }
    } else {
      setIsDrawing(false);

      const drawControl = (
        map as L.Map & {
          _toolbars?: {
            draw?: { _modes: Record<string, { handler: L.Handler }> };
          };
        }
      )._toolbars?.draw;

      if (drawControl) {
        Object.values(drawControl._modes).forEach(mode => {
          if (mode.handler.enabled()) {
            mode.handler.disable();
          }
        });
      }
    }
  }, [activeTool]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    function handleDrawStart() {
      setIsDrawing(true);
    }
    function handleDrawEnd() {
      setIsDrawing(false);
    }

    map.on('draw:drawstart', handleDrawStart);
    map.on('draw:drawstop', handleDrawEnd);
    map.on('draw:created', handleDrawEnd);
    map.on('draw:canceled', handleDrawEnd);

    return () => {
      map.off('draw:drawstart', handleDrawStart);
      map.off('draw:drawstop', handleDrawEnd);
      map.off('draw:created', handleDrawEnd);
      map.off('draw:canceled', handleDrawEnd);
    };
  }, []);

  const handleLocationSearch = useCallback(
    (lat: number, lon: number) => {
      setShouldAnimate(true);
      onViewportChange([lat, lon], 14);
      setTimeout(() => setShouldAnimate(false), 1600);
    },
    [onViewportChange]
  );

  const handleShapeCreated = useCallback(
    (e: L.DrawEvents.Created) => {
      const { layerType, layer } = e;
      let coordinates: number[][] | number[][][] = [];
      let kind: FeatureKind = 'polygon';
      let radius: number | undefined;

      if (layerType === 'marker' && layer instanceof L.Marker) {
        const latlng = layer.getLatLng();
        coordinates = [[latlng.lat, latlng.lng]];
        kind = 'point';
      } else if (layerType === 'polyline' && layer instanceof L.Polyline) {
        const latlngs = layer.getLatLngs() as L.LatLng[];
        coordinates = latlngs.map(latlng => [latlng.lat, latlng.lng]);
        kind = 'line';
      } else if (layerType === 'circle' && layer instanceof L.Circle) {
        const latlng = layer.getLatLng();
        coordinates = [[latlng.lat, latlng.lng]];
        radius = layer.getRadius();
        kind = 'circle';
      } else if (layerType === 'polygon' && layer instanceof L.Polygon) {
        const latlngs = layer.getLatLngs() as L.LatLng[][];
        coordinates = [latlngs[0].map(latlng => [latlng.lat, latlng.lng])];
        kind = 'polygon';
      } else if (layerType === 'rectangle' && layer instanceof L.Rectangle) {
        const bounds = layer.getBounds();
        coordinates = [
          [
            [bounds.getNorth(), bounds.getWest()],
            [bounds.getNorth(), bounds.getEast()],
            [bounds.getSouth(), bounds.getEast()],
            [bounds.getSouth(), bounds.getWest()],
            [bounds.getNorth(), bounds.getWest()],
          ],
        ];
        kind = 'rectangle';
      }

      onAddFeature(kind, coordinates, undefined, radius);
      onActivateTool(null);
    },
    [onAddFeature, onActivateTool]
  );

  // ok this is ugly but it works - matching leaflet internal IDs to our features
  const handleShapeEdited = useCallback(
    (e: L.DrawEvents.Edited) => {
      const layers = e.layers;
      layers.eachLayer((layer: L.Layer) => {
        const leafletId = (layer as L.Layer & { _leaflet_id: number })
          ._leaflet_id;
        const feature = features.find(
          f =>
            (f as AreaOfInterest & { _leafletId?: number })._leafletId ===
            leafletId
        );

        if (feature) {
          let newCoordinates: number[][] | number[][][] = [];

          if (layer instanceof L.Marker) {
            const latlng = layer.getLatLng();
            newCoordinates = [[latlng.lat, latlng.lng]];
          } else if (
            layer instanceof L.Polyline &&
            !(layer instanceof L.Polygon)
          ) {
            const latlngs = layer.getLatLngs() as L.LatLng[];
            newCoordinates = latlngs.map(latlng => [latlng.lat, latlng.lng]);
          } else if (layer instanceof L.Circle) {
            const latlng = layer.getLatLng();
            newCoordinates = [[latlng.lat, latlng.lng]];
            onUpdateFeature(feature.id, {
              coordinates: newCoordinates,
              radius: layer.getRadius(),
            });
            return;
          } else if (layer instanceof L.Polygon) {
            const latlngs = layer.getLatLngs() as L.LatLng[][];
            newCoordinates = [
              latlngs[0].map(latlng => [latlng.lat, latlng.lng]),
            ];
          }

          if (newCoordinates.length > 0) {
            onUpdateFeature(feature.id, { coordinates: newCoordinates });
          }
        }
      });
    },
    [features, onUpdateFeature]
  );

  const handleShapeDeleted = useCallback(
    (e: L.DrawEvents.Deleted) => {
      const layers = e.layers;
      layers.eachLayer((layer: L.Layer) => {
        const leafletId = (layer as L.Layer & { _leaflet_id: number })
          ._leaflet_id;
        const feature = features.find(
          f =>
            (f as AreaOfInterest & { _leafletId?: number })._leafletId ===
            leafletId
        );
        if (feature) {
          onSelectFeature(null);
        }
      });
    },
    [features, onSelectFeature]
  );

  const zoomIn = useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const zoomOut = useCallback(() => {
    mapRef.current?.zoomOut();
  }, []);

  const resetView = useCallback(() => {
    setShouldAnimate(true);
    onViewportChange([50.9375, 6.9603], 13);
    setTimeout(() => setShouldAnimate(false), 1600);
  }, [onViewportChange]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    function handleFullscreenToggle() {
      setIsFullscreen(!!document.fullscreenElement);
    }

    document.addEventListener('fullscreenchange', handleFullscreenToggle);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenToggle);
  }, []);

  const renderedFeatures = useMemo(() => {
    if (!showFeatures) return null;

    return features.map(feature => (
      <GeometryRenderer
        key={feature.id}
        feature={feature}
        isActive={feature.id === activeFeatureId}
        onSelect={() => onSelectFeature(feature.id)}
      />
    ));
  }, [features, activeFeatureId, showFeatures, onSelectFeature]);

  return (
    <div className="flex-1 relative" ref={containerRef}>
      <div className="absolute top-4 left-4 z-[1000]">
        <SearchBar onLocationFound={handleLocationSearch} />
      </div>

      <div className="absolute top-4 right-4 z-[1000]">
        <LayerControl
          showWMSLayer={showSatellite}
          showAOILayer={showFeatures}
          onToggleWMS={onToggleSatellite}
          onToggleAOI={onToggleFeatures}
        />
      </div>

      <MapControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <MapContainer
        center={viewport.center}
        zoom={viewport.zoom}
        className={`h-full w-full ${isDrawing ? 'cursor-crosshair' : ''}`}
        zoomControl={false}
        ref={mapRef}
      >
        <ViewportSync
          center={viewport.center}
          zoom={viewport.zoom}
          shouldAnimate={shouldAnimate}
        />
        <InteractionHandler
          onViewportChange={onViewportChange}
          isDrawing={isDrawing}
        />

        {!showSatellite && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
        )}

        {showSatellite && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            maxZoom={19}
          />
        )}

        {renderedFeatures}

        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={handleShapeCreated}
            onEdited={handleShapeEdited}
            onDeleted={handleShapeDeleted}
            draw={{
              marker: activeTool === 'point' ? { repeatMode: false } : false,
              polyline:
                activeTool === 'line'
                  ? {
                      shapeOptions: { color: '#3b82f6', weight: 3 },
                      repeatMode: false,
                      showLength: true,
                    }
                  : false,
              polygon:
                activeTool === 'polygon'
                  ? {
                      allowIntersection: false,
                      drawError: {
                        color: '#e74c3c',
                        message: 'You cannot draw shapes that intersect',
                      },
                      shapeOptions: {
                        color: '#3b82f6',
                        weight: 3,
                        fillOpacity: 0.3,
                      },
                      repeatMode: false,
                      showArea: true,
                    }
                  : false,
              rectangle:
                activeTool === 'rectangle'
                  ? {
                      shapeOptions: {
                        color: '#3b82f6',
                        weight: 3,
                        fillOpacity: 0.3,
                      },
                      repeatMode: false,
                      showArea: true,
                    }
                  : false,
              circle:
                activeTool === 'circle'
                  ? {
                      shapeOptions: {
                        color: '#3b82f6',
                        weight: 3,
                        fillOpacity: 0.3,
                      },
                      repeatMode: false,
                      showRadius: true,
                    }
                  : false,
              circlemarker: false,
            }}
            edit={{
              edit: isEditMode
                ? {
                    selectedPathOptions: {
                      color: '#10b981',
                      fillColor: '#10b981',
                      opacity: 0.8,
                      fillOpacity: 0.4,
                    },
                  }
                : false,
              remove: isEditMode,
            }}
          />
        </FeatureGroup>
      </MapContainer>

      {showOptimizationWarning && (
        <div className="absolute bottom-6 left-6 z-[1000] bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-yellow-800">
            Large dataset detected. Performance optimizations active.
          </p>
        </div>
      )}

      {activeTool && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-blue-600 text-white rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm font-medium">
            {activeTool === 'point' && 'Click on the map to place a point'}
            {activeTool === 'line' &&
              'Click to add vertices. Double-click to finish.'}
            {activeTool === 'polygon' &&
              'Click to add vertices. Click first point or double-click to close shape.'}
            {activeTool === 'rectangle' && 'Click and drag to draw a rectangle'}
            {activeTool === 'circle' && 'Click center, then drag to set radius'}
          </p>
        </div>
      )}
    </div>
  );
};
