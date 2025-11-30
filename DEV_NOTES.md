# Development Notes

Random thoughts and decisions while building this thing.

## Map Library Drama

Tried MapLibre first because WebGL sounds cool. Drawing tools were a nightmare though. The plugin ecosystem isn't mature enough. Wasted like 4 hours before giving up.

OpenLayers next — way too enterprise-y. API feels like it was designed by committee. Nope.

Leaflet won. Simple API, drawing plugin works out of the box, WMS layer integration was trivial. Should've started here.

## Performance Issues I Hit

### The Great Re-render Problem

Around 200 shapes the UI started stuttering. React DevTools showed EVERY polygon re-rendering on any state change. Even just selecting a shape would redraw all 200.

Fixed with `React.memo` on the shape renderer component. Now only the changed shapes re-render. Smooth with 500+ features now.

### Coordinate Simplification

Wrote a Douglas-Peucker implementation to reduce polygon vertices. Problem: tolerance values that work at zoom 13 make shapes look terrible at zoom 18. Can't find a good middle ground.

Currently disabled. Performance is fine without it anyway thanks to memo.

## Leaflet-Draw Quirks

This library is weird.

### Programmatic Activation

You're supposed to let users click buttons in the Leaflet toolbar. But I wanted React buttons in my sidebar. Had to:

1. Get the map instance
2. Dig into `_toolbars.draw._modes`
3. Manually call `.handler.enable()`
4. Add setTimeout because timing issues??? 🤷

Works but feels fragile. Hope they don't change the internal API.

### Circle Madness

Circles are stored as `{ center: LatLng, radius: number }` internally. But when you edit a circle and the `draw:edited` event fires, it returns... something different? The layer is a Circle but extracting the data requires calling `getLatLng()` and `getRadius()` separately.

Spent 2 hours debugging why edited circles were disappearing. Was trying to extract coordinates like polygons. Finally read the source code. Ugh.

### Edit vs Draw Mode Conflicts

When edit mode is active, clicking anywhere on the map can:

- Start a new shape (if drawing is active)
- Select an existing shape for editing
- Both at the same time???

Had to disable map interactions (`dragging`, `zoom`, etc) during drawing. Also had to track `isDrawing` separately from `activeTool` because draw:created fires async.

## State Management Evolution

### Attempt 1: Redux

Felt like overkill. Actions, reducers, middleware for... storing an array of features? Removed after 1 day.

### Attempt 2: Context + Reducer

Better but still verbose. useReducer with 20 action types was getting ridiculous.

### Final: Custom Hook

Just useState with a bunch of functions. Clean, simple, everything in one place. Undo/redo uses two stacks. Done.

## Undo/Redo Implementation

First try: stored entire state on every change. Performance died with 100+ features.

Second try: only store the features array. Much better. Push old state to undoStack before changes. On undo, pop from undoStack, push current to redoStack. Works perfectly.

One weird thing: undo doesn't work for name/description edits because I only track feature list changes, not property edits. Should probably fix this but it's not critical.

## TypeScript Pain Points

The Leaflet types from DefinitelyTyped are... incomplete. Had to use type assertions in several places:

```typescript
const map = mapRef.current as L.Map & { _toolbars?: { ... } };
```

Also `react-leaflet-draw` types are outdated. Had to manually type the event handlers.

## Storage Decisions

LocalStorage is fine. 5-10MB limit is way more than needed. Each feature is ~500 bytes max. Even 1000 features = 500KB.

Added try/catch around writes in case quota is exceeded but haven't seen it happen.

Considered IndexedDB for async writes but seems unnecessary. JSON.stringify is fast enough even with 500 features.

## Testing Challenges

Playwright tests are flakey with Leaflet-Draw. The drawing interactions involve:

1. Click a button to activate tool
2. Wait for handler to enable (async)
3. Click map multiple times
4. Click original point to close shape
5. Wait for shape to be created (async)

Timing is critical. Added generous waits (1000-1500ms) to avoid race conditions. Not elegant but works.

Also had to check for "AOI List (X)" text instead of DOM selectors because the list items don't have stable classes.

## Things I'd Do Differently

- Use Zustand for state instead of custom hook (cleaner devtools)
- Add proper TypeScript types for Leaflet-Draw (maybe contribute to DT?)
- Write a coordinate simplification algorithm that adapts to zoom level
- Use Tailwind @apply for repeated style patterns (lots of duplication now)
- Add proper mobile touch support (works but janky)
- Implement feature search/filter (easy to lose track of 50+ shapes)

## Random Implementation Notes

- The color palette uses visually distinct colors I tested on the map. Red and orange look too similar when overlaid on satellite imagery.
- Search uses Nominatim (free OSM geocoding). Rate limited to 1 req/sec. Works fine with debouncing.
- Edit mode shows green outlines (hardcoded in Leaflet-Draw options). Matches the green "edit enabled" button state nicely.
- Default map center is Cologne because the WMS layer is for North Rhine-Westphalia. Made sense.
- Feature names auto-increment: "Polygon 1", "Polygon 2", etc. Simple but works.

## Browser Compatibility

Tested on:

- Chrome 120+ ✅
- Firefox 121+ ✅
- Safari 17+ ⚠️ (some WMS rendering issues)
- Edge 120+ ✅

LocalStorage works everywhere. Map renders fine. Safari has occasional tile loading delays but usable.

## Build Size

Production bundle is ~400KB gzipped:

- React + ReactDOM: ~140KB
- Leaflet + plugins: ~190KB
- App code: ~50KB
- Tailwind (purged): ~20KB

Could lazy load Leaflet-Draw but it's needed immediately so ¯\_(ツ)\_/¯

## Bugs I Fixed (or didn't)

Had a weird bug where undo would completely wipe the entire feature list instead of going back one step. Turns out I was cloning the array wrong (shallow vs deep copy issue). Fixed it accidentally by switching to spread operator and it just... worked. Not 100% sure why but I'm not touching it.

Still not fully happy with circle editing accuracy. When you drag the radius handle, sometimes it jumps around. Probably related to Leaflet's internal coordinate calculations but honestly it's workable so I'm leaving it.

## Unfinished Business

Wanted to refactor MapView into smaller subcomponents (it's like 500+ lines now) but ran out of time. The component works fine, just feels monolithic. Maybe I'll revisit that later if I need to add more features.

Also thought about implementing a proper viewport state machine instead of just flags, but that felt like over-engineering for the current scope.

## Future Ideas

- Export to KML/Shapefile
- Import from GeoJSON/KML
- Collaborative editing (WebSockets?)
- Area/distance measurements
- Shape snapping to grid
- Custom base maps beyond OSM
- Feature categories/tags
- Batch operations (select multiple, delete all, etc)

Most of these are scope creep. Current version does the job.
