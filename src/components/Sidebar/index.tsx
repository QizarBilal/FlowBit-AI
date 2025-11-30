import React, { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(true);

  function handleToolClick(tool: FeatureKind) {
    onActivateTool(activeTool === tool ? null : tool);
  }

  return (
    <>
      {/* Toggle Button - All Screen Sizes */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-[2000] bg-blue-600 text-white p-2.5 lg:p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ${isOpen ? 'left-[17.5rem] lg:left-[20.5rem]' : 'left-4'}`}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        title={isOpen ? 'Close sidebar (Ctrl+B)' : 'Open sidebar (Ctrl+B)'}
      >
        <svg
          className="w-5 h-5 lg:w-6 lg:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 lg:w-80 bg-white border-r border-gray-200 shadow-2xl flex flex-col z-[1500] transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="px-4 lg:px-5 py-4 lg:py-5 border-b border-gray-200 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 text-white shadow-md">
          <h1 className="text-base lg:text-lg font-bold tracking-tight">
            AOI Creation Tool
          </h1>
          <p className="text-xs text-blue-50 mt-1.5 font-medium">
            Define and manage areas of interest
          </p>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Drawing Tools */}
          <div className="p-3 lg:p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Drawing Tools
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(['point', 'line', 'polygon', 'rectangle'] as FeatureKind[]).map(
                tool => (
                  <button
                    key={tool}
                    onClick={() => handleToolClick(tool)}
                    className={`px-3 py-2.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all shadow-sm ${
                      activeTool === tool
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                    aria-label={`Draw ${tool}`}
                    aria-pressed={activeTool === tool}
                  >
                    {tool.charAt(0).toUpperCase() + tool.slice(1)}
                  </button>
                )
              )}
              <button
                onClick={() => handleToolClick('circle')}
                className={`px-3 py-2.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all shadow-sm col-span-2 ${
                  activeTool === 'circle'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
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
              className={`w-full px-3 py-2.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all shadow-sm mb-2 ${
                isEditMode
                  ? 'bg-green-600 text-white shadow-md ring-2 ring-green-300'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
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
                className="flex-1 px-3 py-2.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm border border-gray-200"
                aria-label="Undo"
                title="Undo (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="flex-1 px-3 py-2.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm border border-gray-200"
                aria-label="Redo"
                title="Redo (Ctrl+Y)"
              >
                ↷ Redo
              </button>
            </div>
          </div>

          {/* Edit AOI Section - Prominently placed */}
          {selectedFeature && (
            <div className="p-3 lg:p-4 border-b-4 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm lg:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div
                    className="w-3 h-3 lg:w-4 lg:h-4 rounded-full ring-2 ring-white shadow-sm"
                    style={{ backgroundColor: selectedFeature.color }}
                  />
                  Edit AOI
                </h2>
                <button
                  onClick={() => onSelectFeature(null)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg p-1 transition-colors"
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

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={selectedFeature.name}
                    onChange={e =>
                      onUpdateFeature(selectedFeature.id, {
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 lg:py-2 border-2 border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter AOI name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={selectedFeature.description}
                    onChange={e =>
                      onUpdateFeature(selectedFeature.id, {
                        description: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2.5 lg:py-2 border-2 border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                    placeholder="Add notes..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Color
                  </label>
                  <div className="flex items-center gap-3 bg-white p-2 rounded-lg border-2 border-gray-300">
                    <input
                      type="color"
                      value={selectedFeature.color}
                      onChange={e =>
                        onUpdateFeature(selectedFeature.id, {
                          color: e.target.value,
                        })
                      }
                      className="w-12 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 font-mono font-semibold">
                      {selectedFeature.color}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteFeature(selectedFeature.id)}
                  className="w-full px-3 py-2.5 lg:py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
                >
                  🗑️ Delete AOI
                </button>
              </div>
            </div>
          )}

          {/* AOI List */}
          <div className="p-3 lg:p-4 bg-gray-50 min-h-[300px]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                AOI List
              </h2>
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                {features.length}
              </span>
            </div>

            <div className="space-y-2">
              {features.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm font-semibold">No AOIs created yet</p>
                  <p className="text-xs mt-1">
                    Use the drawing tools above to start
                  </p>
                </div>
              ) : (
                features.map(feature => (
                  <button
                    key={feature.id}
                    onClick={() => onSelectFeature(feature.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all shadow-sm hover:shadow-md ${
                      activeFeatureId === feature.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <div
                        className="w-3 h-3 lg:w-4 lg:h-4 rounded-full ring-2 ring-white shadow-sm flex-shrink-0"
                        style={{ backgroundColor: feature.color }}
                      />
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {feature.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 capitalize font-medium ml-5 lg:ml-6">
                      {feature.type}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[1400] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
