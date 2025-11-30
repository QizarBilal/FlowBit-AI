import { useEffect } from 'react';
import { MapView } from './components/MapView';
import { Sidebar } from './components/Sidebar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useWorkspace } from './state/workspace';

function App() {
  const {
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
    canUndo,
    canRedo,
  } = useWorkspace();

  // keyboard shortcuts - ctrl+z, ctrl+shift+z, escape
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      const isModKey = e.ctrlKey || e.metaKey;

      if (isModKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (isModKey && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault();
        redo();
      } else if (e.key === 'Escape') {
        // escape cancels everything, super handy
        setTool(null);
        setEditMode(false);
        selectFeature(null);
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [undo, redo, setTool, setEditMode, selectFeature]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          features={workspace.features}
          activeFeatureId={workspace.activeFeatureId}
          onSelectFeature={selectFeature}
          onUpdateFeature={updateFeature}
          onDeleteFeature={deleteFeature}
          activeTool={workspace.activeTool}
          isEditMode={workspace.isEditMode}
          onActivateTool={setTool}
          onToggleEditMode={setEditMode}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <MapView
          features={workspace.features}
          activeFeatureId={workspace.activeFeatureId}
          showSatellite={workspace.showSatellite}
          showFeatures={workspace.showFeatures}
          activeTool={workspace.activeTool}
          isEditMode={workspace.isEditMode}
          viewport={workspace.viewport}
          onAddFeature={addFeature}
          onUpdateFeature={updateFeature}
          onSelectFeature={selectFeature}
          onToggleSatellite={toggleSatellite}
          onToggleFeatures={toggleFeatures}
          onViewportChange={setViewport}
          onActivateTool={setTool}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
