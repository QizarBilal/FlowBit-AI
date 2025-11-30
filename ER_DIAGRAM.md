# Data Model

Entity Relationships

```
┌─────────────────────────────────┐
│      AreaOfInterest             │
├─────────────────────────────────┤
│ id: string (PK)                 │
│ name: string                    │
│ description: string             │
│ type: FeatureKind               │
│ coordinates: number[][]         │
│ radius?: number                 │
│ color: string                   │
│ createdAt: string               │
│ updatedAt: string               │
│ geoJSON?: GeoJSON.Feature       │
└─────────────────────────────────┘
           │
           │ 1:N
           ▼
┌─────────────────────────────────┐
│      WorkspaceState             │
├─────────────────────────────────┤
│ features: AreaOfInterest[]      │
│ activeFeatureId: string?        │
│ activeTool: FeatureKind?        │
│ isEditMode: boolean             │
│ showSatellite: boolean          │
│ showFeatures: boolean           │
│ searchQuery: string             │
│ undoStack: AreaOfInterest[][]   │
│ redoStack: AreaOfInterest[][]   │
│ viewport: ViewportState         │
└─────────────────────────────────┘
           │
           │ contains
           ▼
┌─────────────────────────────────┐
│      ViewportState              │
├─────────────────────────────────┤
│ center: [number, number]        │
│ zoom: number                    │
└─────────────────────────────────┘
```

Type Definitions

FeatureKind can be 'point', 'line', 'polygon', 'rectangle', or 'circle'.

Storage

All data persists to localStorage using these keys:

features stores an array of AreaOfInterest objects
viewport stores the ViewportState object
layerPrefs stores layer visibility preferences

How Things Connect

WorkspaceState contains many AreaOfInterest features in a one-to-many relationship. WorkspaceState also has one ViewportState in a one-to-one relationship. Each entry in the undo/redo stacks contains a complete snapshot of all features. The activeFeatureId property optionally references a feature by its id.
