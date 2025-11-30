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
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-3 lg:p-4 space-y-2.5 border border-gray-200">
      <h3 className="text-xs lg:text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        Layers
      </h3>
      <label className="flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          checked={showWMSLayer}
          onChange={onToggleWMS}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-700">Satellite Imagery</span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          checked={showAOILayer}
          onChange={onToggleAOI}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-700">AOI Shapes</span>
      </label>
    </div>
  );
};
