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
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Layers</h3>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showWMSLayer}
          onChange={onToggleWMS}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Satellite Imagery</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showAOILayer}
          onChange={onToggleAOI}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">AOI Shapes</span>
      </label>
    </div>
  );
};
