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

  // toggle tool on/off when clicking same button twice
  function handleToolClick(tool: FeatureKind) {
    onActivateTool(activeTool === tool ? null : tool);
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">AOI Creation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Define areas of interest on the map
        </p>
      </div>

      <div className="p-5 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700 mb-3">
          Drawing Tools
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleToolClick('point')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTool === 'point'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Draw point"
            aria-pressed={activeTool === 'point'}
          >
            Point
          </button>
          <button
            onClick={() => handleToolClick('line')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTool === 'line'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Draw line"
            aria-pressed={activeTool === 'line'}
          >
            Line
          </button>
          <button
            onClick={() => handleToolClick('polygon')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTool === 'polygon'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Draw polygon"
            aria-pressed={activeTool === 'polygon'}
          >
            Polygon
          </button>
          <button
            onClick={() => handleToolClick('rectangle')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTool === 'rectangle'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Draw rectangle"
            aria-pressed={activeTool === 'rectangle'}
          >
            Rectangle
          </button>
          <button
            onClick={() => handleToolClick('circle')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2 ${
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

        <button
          onClick={() => onToggleEditMode(!isEditMode)}
          className={`w-full mt-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isEditMode
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Toggle edit mode"
          aria-pressed={isEditMode}
        >
          {isEditMode ? 'Edit Shapes Enabled' : 'Enable Shape Editing'}
        </button>

        <div className="flex gap-2 mt-3">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
          >
            Redo
          </button>
        </div>
      </div>

      {selectedFeature && (
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-700">Edit AOI</h2>
            <button
              onClick={() => onSelectFeature(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={selectedFeature.name}
                onChange={e =>
                  onUpdateFeature(selectedFeature.id, { name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={selectedFeature.description}
                onChange={e =>
                  onUpdateFeature(selectedFeature.id, {
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="color"
                value={selectedFeature.color}
                onChange={e =>
                  onUpdateFeature(selectedFeature.id, { color: e.target.value })
                }
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={() => onDeleteFeature(selectedFeature.id)}
              className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete AOI
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-3">
          AOI List ({features.length})
        </h2>
        <div className="space-y-2">
          {features.length === 0 ? (
            <p className="text-sm text-gray-500">
              No AOIs created yet. Use the drawing tools above to create one.
            </p>
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
                  <span className="text-sm font-medium text-gray-900">
                    {feature.name}
                  </span>
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {feature.type}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
