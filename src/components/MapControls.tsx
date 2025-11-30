import React from 'react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleFullscreen,
  isFullscreen,
}) => {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
      <button
        onClick={onZoomIn}
        className="w-10 h-10 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:bg-gray-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Zoom in"
        title="Zoom in"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      <button
        onClick={onZoomOut}
        className="w-10 h-10 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:bg-gray-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Zoom out"
        title="Zoom out"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </button>

      <button
        onClick={onResetView}
        className="w-10 h-10 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:bg-gray-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Reset view"
        title="Reset view"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      <button
        onClick={onToggleFullscreen}
        className="w-10 h-10 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:bg-gray-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        )}
      </button>
    </div>
  );
};
