import React from 'react';

interface LayerControlProps {
  showWMSLayer: boolean;
  showAOILayer: boolean;
  onToggleWMS: () => void;
  onToggleAOI: () => void;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  showWMSLayer,
  showAOILayer,
  onToggleWMS,
  onToggleAOI,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-3 border border-gray-200 min-w-[200px]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Map Layers</h3>
      </div>
      
      <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="relative">
          <input
            type="checkbox"
            checked={showWMSLayer}
            onChange={onToggleWMS}
            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
          />
          {showWMSLayer && (
            <svg className="w-3 h-3 text-blue-600 absolute top-1 left-1 pointer-events-none" fill="currentColor" viewBox="0 0 12 12">
              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Satellite Imagery</span>
          </div>
          <span className="text-xs text-gray-500 ml-6">WMS Layer</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${showWMSLayer ? 'bg-green-500' : 'bg-gray-300'}`} />
      </label>
      
      <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="relative">
          <input
            type="checkbox"
            checked={showAOILayer}
            onChange={onToggleAOI}
            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
          />
          {showAOILayer && (
            <svg className="w-3 h-3 text-blue-600 absolute top-1 left-1 pointer-events-none" fill="currentColor" viewBox="0 0 12 12">
              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">AOI Shapes</span>
          </div>
          <span className="text-xs text-gray-500 ml-6">Vector Layer</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${showAOILayer ? 'bg-purple-500' : 'bg-gray-300'}`} />
      </label>
    </div>
  );
};
