# AOI Creation Tool

An interactive web application for drawing and managing Areas of Interest on a map with satellite imagery overlay support.

Getting Started

```bash
npm install
npm run dev    # Development server on localhost:5173
npm run build  # Production build
npm test       # Run E2E tests
```

What It Does

The application provides drawing tools for creating points, lines, polygons, rectangles, and circles directly on the map. Users can edit shapes by dragging vertices, toggle between base map and Esri World satellite imagery, and search for locations using Nominatim geocoding. Undo/redo functionality is available with keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z), and all features plus viewport state auto-save to localStorage. Each area of interest can be named, described, and color-coded.

Technical Approach

Map Library Selection

Leaflet with React-Leaflet was selected after evaluating several options. The drawing plugin (leaflet-draw) provides native editing support, satellite layer integration is straightforward, and the library is lighter than alternatives like OpenLayers and MapLibre. The ecosystem is mature with good documentation.

State Management

A custom React hook called useWorkspace handles all application state. This includes feature collection management, undo/redo stack implementation, viewport persistence, and layer visibility preferences. This pattern avoids the complexity of Redux or MobX while keeping things organized in a single-view application.

Storage Strategy

LocalStorage provides simple key-value persistence that works well for coordinate arrays. The 5-10MB quota is sufficient for 500+ features, and the synchronous API eliminates async complexity. No additional dependencies are needed since browser support is built-in.

Performance

Component memoization prevents unnecessary re-renders. A performance warning appears at 100+ features. Coordinate simplification utilities are available but not enabled by default. State updates are efficient with selective re-rendering.

Performance ranges from optimal with under 50 features to requiring memoization and careful updates beyond 200 features. Between 50-100 features, rendering is smooth with minor delays on bulk operations. The 100-200 range hits the warning threshold where simplification is recommended.

Technology Stack

Frontend: React 18.3, TypeScript 5.3
Build Tool: Vite 5.0
Styling: Tailwind CSS 3.4
Mapping: Leaflet 1.9.4, React-Leaflet 4.2.1
Drawing: Leaflet-Draw 1.0.4
Testing: Playwright 1.40
Satellite Imagery: Esri World Imagery

Project Structure

```
src/
├── App.tsx
├── main.tsx
├── types.ts
├── helpers.ts
├── components/
│   ├── MapView/
│   ├── Sidebar/
│   ├── SearchBar.tsx
│   ├── MapControls.tsx
│   └── LayerControl.tsx
├── state/
│   └── workspace.ts
└── services/
    ├── storage.ts
    ├── geo.ts
    └── geocoding.ts
```

Testing

Playwright handles end-to-end testing for critical user workflows:

```bash
npm test
npx playwright test --ui
npx playwright show-report
```

Test files cover shape creation and persistence (drawing.spec.ts), layer visibility and state management (layers.spec.ts), and history operations with keyboard shortcuts (undo.spec.ts).

Development Time

The project took roughly 28 hours over 4 days. Map library evaluation and setup took 4 hours. Drawing tool implementation required 6 hours. Edit and delete functionality needed 3 hours. UI components including sidebar and controls took 4 hours. The undo/redo system took 3 hours. Search and layer controls needed 2 hours. Persistence layer implementation was 2 hours. Testing and documentation took 2 hours. Bug fixes and polish rounded out the last 2 hours.

Implementation Challenges

Leaflet-Draw expects UI-driven interactions rather than programmatic control. Direct handler manipulation via the \_toolbars property was necessary for React prop-driven activation. This felt hacky but was the only way to integrate with React's component model.

Edit mode conflicts arose when simultaneous drawing and editing both tried to handle map interactions. Careful event handler management prevented map panning from interfering with vertex manipulation. The solution involved disabling certain map interactions during active drawing sessions.

State persistence initially tried to save the entire workspace state, which caused deserialization issues on reload. The fix was to persist only feature data and viewport state, then reconstruct UI state from that minimal data on load.

Known Limitations

Circle editing behaves differently between create and edit modes due to how Leaflet-Draw handles circle geometry. The undo/redo system only tracks shape changes, not property edits like name or description changes. Mobile touch interactions work but need optimization for a better experience. Export is limited to GeoJSON format with no shapefile support.

Additional Documentation

DEV_NOTES.md contains the development journal and implementation decisions. ER_DIAGRAM.md documents the data model and relationships. API_DOCUMENTATION.md covers component APIs and usage patterns.

License

MIT