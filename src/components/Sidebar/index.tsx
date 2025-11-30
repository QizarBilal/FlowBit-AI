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
    <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col h-screen shadow-sm">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AOI Creator</h1>
            <p className="text-xs text-gray-500">Area of Interest Tool</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Draw and manage geographic areas on the map
        </p>
      </div>

      {/* Drawing Tools Section */}
      <div className="p-5 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Drawing Tools
          </h2>
          {activeTool && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              Active
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleToolClick('point')}
            className={`px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col items-center gap-1 ${
              activeTool === 'point'
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm border border-gray-200'
            }`}
            aria-label="Draw point"
            aria-pressed={activeTool === 'point'}
            title="Click map to place a marker"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Point</span>
          </button>
          <button
            onClick={() => handleToolClick('line')}
            className={`px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col items-center gap-1 ${
              activeTool === 'line'
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm border border-gray-200'
            }`}
            aria-label="Draw line"
            aria-pressed={activeTool === 'line'}
            title="Click to add points, double-click to finish"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Line</span>
          </button>
          <button
            onClick={() => handleToolClick('polygon')}
            className={`px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col items-center gap-1 ${
              activeTool === 'polygon'
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm border border-gray-200'
            }`}
            aria-label="Draw polygon"
            aria-pressed={activeTool === 'polygon'}
            title="Create custom shape"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span>Polygon</span>
          </button>
          <button
            onClick={() => handleToolClick('rectangle')}
            className={`px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col items-center gap-1 ${
              activeTool === 'rectangle'
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm border border-gray-200'
            }`}
            aria-label="Draw rectangle"
            aria-pressed={activeTool === 'rectangle'}
            title="Click and drag to draw rectangle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
            </svg>
            <span>Rectangle</span>
          </button>
          <button
            onClick={() => handleToolClick('circle')}
            className={`px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2 flex items-center justify-center gap-2 ${
              activeTool === 'circle'
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm border border-gray-200'
            }`}
            aria-label="Draw circle"
            aria-pressed={activeTool === 'circle'}
            title="Click center, drag to set radius"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
            <span>Circle</span>
          </button>
        </div>

        {/* Edit Mode Toggle */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onToggleEditMode(!isEditMode)}
            className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 flex items-center justify-center gap-2 ${
              isEditMode
                ? 'bg-green-600 text-white shadow-md focus:ring-green-500 hover:bg-green-700'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 focus:ring-blue-500'
            }`}
            aria-label="Toggle edit mode"
            aria-pressed={isEditMode}
            title={isEditMode ? 'Click to disable editing' : 'Enable editing to modify shapes'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{isEditMode ? '✓ Editing Enabled' : 'Enable Shape Editing'}</span>
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 px-3 py-2.5 text-sm font-medium rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 border border-gray-200 hover:shadow-sm"
            aria-label="Undo"
            title="Undo last action (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span>Undo</span>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 px-3 py-2.5 text-sm font-medium rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 border border-gray-200 hover:shadow-sm"
            aria-label="Redo"
            title="Redo last undone action (Ctrl+Y)"
          >
            <span>Redo</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {selectedFeature && (
        <div className="p-5 border-b border-gray-200 bg-blue-50 bg-opacity-30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: selectedFeature.color }}
              />
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Edit AOI Details
              </h2>
            </div>
            <button
              onClick={() => onSelectFeature(null)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
              aria-label="Close editor"
              title="Close editor"
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
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Name
              </label>
              <input
                type="text"
                value={selectedFeature.name}
                onChange={e =>
                  onUpdateFeature(selectedFeature.id, { name: e.target.value })
                }
                placeholder="Enter AOI name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-shadow hover:shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
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
                placeholder="Add notes or details about this area..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none transition-shadow hover:shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Color Theme
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedFeature.color}
                  onChange={e =>
                    onUpdateFeature(selectedFeature.id, { color: e.target.value })
                  }
                  className="w-14 h-10 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-gray-400 transition-colors"
                />
                <div className="flex-1">
                  <span className="text-xs text-gray-500 uppercase font-mono tracking-wider">
                    {selectedFeature.color}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <button
                onClick={() => onDeleteFeature(selectedFeature.id)}
                className="w-full px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete AOI
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            My AOI List
          </h2>
          <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {features.length}
          </span>
        </div>
        <div className="space-y-2">
          {features.length === 0 ? (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-sm font-medium text-gray-700 mb-1">No AOIs Yet</p>
              <p className="text-xs text-gray-500">
                Select a drawing tool above to create your first area of interest on the map.
              </p>
            </div>
          ) : (
            features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => onSelectFeature(feature.id)}
                className={`w-full text-left p-3.5 rounded-lg border-2 transition-all duration-200 group ${
                  activeFeatureId === feature.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ring-2 transition-all ${
                        activeFeatureId === feature.id ? 'ring-blue-400' : 'ring-gray-200 group-hover:ring-blue-300'
                      }`}
                      style={{ backgroundColor: feature.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {feature.name}
                        </span>
                        {activeFeatureId === feature.id && (
                          <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                          feature.type === 'point' ? 'bg-purple-100 text-purple-700' :
                          feature.type === 'line' ? 'bg-green-100 text-green-700' :
                          feature.type === 'polygon' ? 'bg-orange-100 text-orange-700' :
                          feature.type === 'rectangle' ? 'bg-blue-100 text-blue-700' :
                          'bg-pink-100 text-pink-700'
                        }`}>
                          {feature.type}
                        </span>
                        {feature.description && (
                          <span className="text-xs text-gray-400" title={feature.description}>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium flex-shrink-0">
                    #{index + 1}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
