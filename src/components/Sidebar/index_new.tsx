import React from 'react';
import { AreaOfInterest, FeatureKind } from '../../types';

interface SidebarProps {
  features: AreaOfInterest[];
  activeFeatureId: string | null;
  onSelectFeature: (id: string | null) => void;
  onUpdateFeature: (id: string, updates: Partial<AreaOfInterest>) => void;
  onDeleteFeature: (id: string) => void;
  activeTool: FeatureKind | null;
  isEditMode: boolean;
  onActivateTool: (tool: FeatureKind | null) => void;
  onToggleEditMode: (enabled: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  features,
  activeFeatureId,
  onSelectFeature,
  onUpdateFeature,
  onDeleteFeature,
  activeTool,
  isEditMode,
  onActivateTool,
  onToggleEditMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const selectedFeature = features.find(f => f.id === activeFeatureId);

  function handleToolClick(tool: FeatureKind) {
    onActivateTool(activeTool === tool ? null : tool);
  }

  return (
    <div className="w-80 bg-white border-r border-gray-300 flex flex-col h-screen">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <h1 className="text-lg font-bold">AOI Creation Tool</h1>
        <p className="text-xs text-blue-100 mt-1">Define areas of interest</p>
      </div>

      {/* Drawing Tools */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Drawing Tools
        </h2>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {(['point', 'line', 'polygon', 'rectangle'] as FeatureKind[]).map(tool => (
            <button
              key={tool}
              onClick={() => handleToolClick(tool)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTool === tool
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={`Draw ${tool}`}
              aria-pressed={activeTool === tool}
            >
              {tool.charAt(0).toUpperCase() + tool.slice(1)}
            </button>
          ))}
          <button
            onClick={() => handleToolClick('circle')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors col-span-2 ${
              activeTool === 'circle'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Draw circle"
            aria-pressed={activeTool === 'circle'}
          >
            Circle
          </button>
        </div>

        {/* Edit Mode Toggle */}
        <button
          onClick={() => onToggleEditMode(!isEditMode)}
          className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-2 ${
            isEditMode
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Toggle edit mode"
          aria-pressed={isEditMode}
        >
          {isEditMode ? '✓ Editing Enabled' : 'Enable Shape Editing'}
        </button>

        {/* Undo/Redo */}
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
          >
            Redo
          </button>
        </div>
      </div>

      {/* Edit AOI Section - Prominently placed */}
      {selectedFeature && (
        <div className="p-4 border-b-4 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedFeature.color }}
              />
              Edit AOI
            </h2>
            <button
              onClick={() => onSelectFeature(null)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close editor"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={selectedFeature.name}
                onChange={e => onUpdateFeature(selectedFeature.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter AOI name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={selectedFeature.description}
                onChange={e =>
                  onUpdateFeature(selectedFeature.id, { description: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add notes..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedFeature.color}
                  onChange={e =>
                    onUpdateFeature(selectedFeature.id, { color: e.target.value })
                  }
                  className="w-12 h-9 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-500 font-mono">{selectedFeature.color}</span>
              </div>
            </div>

            <button
              onClick={() => onDeleteFeature(selectedFeature.id)}
              className="w-full px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete AOI
            </button>
          </div>
        </div>
      )}

      {/* AOI List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            AOI List
          </h2>
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {features.length}
          </span>
        </div>

        <div className="space-y-2">
          {features.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No AOIs created yet.</p>
              <p className="text-xs mt-1">Use the drawing tools above.</p>
            </div>
          ) : (
            features.map(feature => (
              <button
                key={feature.id}
                onClick={() => onSelectFeature(feature.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  activeFeatureId === feature.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: feature.color }}
                  />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {feature.name}
                  </span>
                </div>
                <div className="text-xs text-gray-500 capitalize">{feature.type}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
