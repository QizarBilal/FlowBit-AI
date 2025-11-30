import { useState, useEffect, useCallback } from 'react';
import { AreaOfInterest, WorkspaceState, FeatureKind } from '../types';
import {
  saveFeatures,
  loadFeatures,
  saveViewport,
  loadViewport,
  saveLayerPrefs,
  loadLayerPrefs,
} from '../services/storage';
import { toGeoJSON } from '../services/geo';
import { makeId, pickColor } from '../helpers';

export function useWorkspace() {
  const savedViewport = loadViewport();
  const savedLayers = loadLayerPrefs();

  const [workspace, setWorkspace] = useState<WorkspaceState>({
    features: [],
    activeFeatureId: null,
    activeTool: null,
    isEditMode: false,
    showSatellite: savedLayers?.satellite ?? true,
    showFeatures: savedLayers?.features ?? true,
    searchQuery: '',
    undoStack: [],
    redoStack: [],
    viewport: savedViewport || {
      center: [50.9375, 6.9603], // cologne, default for NRW WMS layer
      zoom: 13,
    },
  });

  // load saved features on mount
  useEffect(() => {
    const loaded = loadFeatures();
    setWorkspace(prev => ({ ...prev, features: loaded }));
  }, []);

  // auto-save features
  useEffect(() => {
    saveFeatures(workspace.features);
  }, [workspace.features]);

  // auto-save viewport
  useEffect(() => {
    saveViewport(workspace.viewport);
  }, [workspace.viewport]);

  // auto-save layer prefs
  useEffect(() => {
    saveLayerPrefs(workspace.showSatellite, workspace.showFeatures);
  }, [workspace.showSatellite, workspace.showFeatures]);

  const addFeature = useCallback(
    (
      kind: FeatureKind,
      coords: number[][] | number[][][],
      customName?: string,
      radiusMeters?: number
    ) => {
      const geoData = toGeoJSON(kind, coords, radiusMeters);
      const now = new Date().toISOString();

      const feature: AreaOfInterest = {
        id: makeId(),
        name:
          customName ||
          `${kind.charAt(0).toUpperCase() + kind.slice(1)} ${workspace.features.length + 1}`,
        description: '',
        type: kind,
        coordinates: coords,
        radius: radiusMeters,
        color: pickColor(),
        createdAt: now,
        updatedAt: now,
        geoJSON: geoData,
      };

      setWorkspace(prev => ({
        ...prev,
        features: [...prev.features, feature],
        activeFeatureId: feature.id,
        undoStack: [...prev.undoStack, prev.features],
        redoStack: [],
      }));
    },
    [workspace.features.length]
  );

  const updateFeature = useCallback(
    (id: string, updates: Partial<AreaOfInterest>) => {
      setWorkspace(prev => {
        const idx = prev.features.findIndex(f => f.id === id);
        if (idx === -1) return prev;

        const updated = {
          ...prev.features[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        const nextFeatures = [...prev.features];
        nextFeatures[idx] = updated;

        return {
          ...prev,
          features: nextFeatures,
          undoStack: [...prev.undoStack, prev.features],
          redoStack: [],
        };
      });
    },
    []
  );

  const deleteFeature = useCallback((id: string) => {
    setWorkspace(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== id),
      activeFeatureId:
        prev.activeFeatureId === id ? null : prev.activeFeatureId,
      undoStack: [...prev.undoStack, prev.features],
      redoStack: [],
    }));
  }, []);

  const selectFeature = useCallback((id: string | null) => {
    setWorkspace(prev => ({ ...prev, activeFeatureId: id }));
  }, []);

  const setTool = useCallback((tool: FeatureKind | null) => {
    setWorkspace(prev => {
      if (prev.activeTool === tool) return { ...prev, activeTool: null };
      return {
        ...prev,
        activeTool: tool,
        isEditMode: false,
      };
    });
  }, []);

  const setEditMode = useCallback((enabled: boolean) => {
    setWorkspace(prev => ({
      ...prev,
      isEditMode: enabled,
      activeTool: enabled ? null : prev.activeTool,
    }));
  }, []);

  const toggleSatellite = useCallback(() => {
    setWorkspace(prev => ({ ...prev, showSatellite: !prev.showSatellite }));
  }, []);

  const toggleFeatures = useCallback(() => {
    setWorkspace(prev => ({ ...prev, showFeatures: !prev.showFeatures }));
  }, []);

  const setViewport = useCallback((center: [number, number], zoom: number) => {
    setWorkspace(prev => ({
      ...prev,
      viewport: { center, zoom },
    }));
  }, []);

  const undo = useCallback(() => {
    setWorkspace(prev => {
      if (prev.undoStack.length === 0) return prev;

      const lastState = prev.undoStack[prev.undoStack.length - 1];
      return {
        ...prev,
        features: lastState,
        undoStack: prev.undoStack.slice(0, -1),
        redoStack: [...prev.redoStack, prev.features],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setWorkspace(prev => {
      if (prev.redoStack.length === 0) return prev;

      const nextState = prev.redoStack[prev.redoStack.length - 1];
      return {
        ...prev,
        features: nextState,
        redoStack: prev.redoStack.slice(0, -1),
        undoStack: [...prev.undoStack, prev.features],
      };
    });
  }, []);

  return {
    workspace,
    addFeature,
    updateFeature,
    deleteFeature,
    selectFeature,
    setTool,
    setEditMode,
    toggleSatellite,
    toggleFeatures,
    setViewport,
    undo,
    redo,
    canUndo: workspace.undoStack.length > 0,
    canRedo: workspace.redoStack.length > 0,
  };
}
