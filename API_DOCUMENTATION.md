# API Documentation

Overview

This document describes the client-side API and data interfaces for the AOI Creation Application. The application currently uses client-side state management with localStorage. A proposed backend API for production deployment is also included.

Current Implementation (Client-Side)

Storage API

Save AOIs

```typescript
function saveAOIs(aois: AOI[]): void;
```

Persists an array of AOI objects to localStorage using the 'aois' key. Takes an array of AOI objects as a parameter and returns nothing.

Example usage:

```typescript
saveAOIs([
  {
    id: '123',
    type: 'polygon',
    name: 'Area 1',
    coordinates: [[[51.5, -0.1], ...]]
  }
]);
```

Load AOIs

```typescript
function loadAOIs(): AOI[];
```

Retrieves the stored AOI array from localStorage. Returns an array of AOI objects, or an empty array if none exist. Reads from the 'aois' storage key.

Example usage:

```typescript
const aois = loadAOIs();
```

Clear AOIs

```typescript
function clearAOIs(): void;
```

Removes all AOIs from localStorage by deleting the 'aois' key. Takes no parameters and returns nothing.

Example usage:

```typescript
clearAOIs();
```

Save Map State

```typescript
function saveMapState(center: [number, number], zoom: number): void;
```

Persists the current map center coordinates and zoom level to localStorage using the 'mapState' key. Center should be an array with latitude and longitude. Zoom level ranges from 1 to 18.

Example usage:

```typescript
saveMapState([51.505, -0.09], 13);
```

Load Map State

```typescript
function loadMapState(): { center: [number, number]; zoom: number } | null;
```

Retrieves the saved map state from localStorage. Returns an object with center coordinates and zoom level, or null if no state is found.

Example usage:

```typescript
const state = loadMapState();
```

Save Layer State

```typescript
function saveLayerState(showWMS: boolean, showAOI: boolean): void;
```

Persists layer visibility settings to localStorage using the 'layerState' key. Takes two boolean parameters for WMS and AOI layer visibility.

Example usage:

```typescript
saveLayerState(true, false);
```

Load Layer State

```typescript
function loadLayerState(): { showWMS: boolean; showAOI: boolean } | null;
```

Retrieves saved layer visibility settings from localStorage. Returns an object with showWMS and showAOI boolean properties, or null if not found.

Example usage:

```typescript
const state = loadLayerState();
```

Geometry API

Convert to GeoJSON

```typescript
function convertToGeoJSON(aoi: AOI): GeoJSON.Feature;
```

Converts the internal AOI format to a standard GeoJSON Feature object. Takes an AOI object and returns a GeoJSON Feature with geometry and properties.

Example usage:

```typescript
const feature = convertToGeoJSON({
  id: '123',
  type: 'polygon',
  coordinates: [[[51.5, -0.1], ...]],
  ...
});
```

From GeoJSON

```typescript
function fromGeoJSON(
  feature: GeoJSON.Feature,
  type: ShapeType
): Omit<AOI, 'id'>;
```

Converts a GeoJSON Feature to the internal AOI format. Takes a GeoJSON Feature object and shape type, returns an AOI object without an ID (which needs to be generated separately).

Example usage:

```typescript
const aoi = fromGeoJSON({
  type: 'Feature',
  geometry: { type: 'Polygon', coordinates: [...] },
  properties: { name: 'Area 1' }
}, 'polygon');
```

Calculate Area

```typescript
function calculateArea(coordinates: number[][][]): number;
```

Calculates the area of a polygon in square kilometers using the spherical excess formula for geographic coordinates. Takes polygon coordinates and returns the area in km².

Example usage:

```typescript
const area = calculateArea([[[51.5, -0.1], [51.51, -0.09], ...]]);
```

Simplify Geometry

```typescript
function simplifyGeometry(
  coordinates: number[][],
  tolerance: number = 0.0001
): number[][];
```

Simplifies line or polygon coordinates using the Douglas-Peucker algorithm. Tolerance parameter defaults to 0.0001.
Parameters:

- coordinates: Array of [lat, lng] points
- tolerance: Simplification tolerance (default: 0.0001)
  Returns: Simplified coordinate array
  Reduction: ~70% fewer points with default tolerance
  Example:
  const simplified = simplifyGeometry(
  [[51.5, -0.1], [51.501, -0.101], ...], // 1000 points
  0.0001
  );
  // Returns ~300 points with visual fidelity preserved

````

---

### Geocoding API

#### Search Location

```typescript
async function searchLocation(query: string): Promise<SearchResult[]>

Description: Searches for locations using Nominatim geocoding
API Endpoint: https://nominatim.openstreetmap.org/search
Parameters:
  - query: Location search string (e.g., "Berlin", "Times Square")
Returns: Array of search results with coordinates
Rate Limit: 1 request per second (Nominatim policy)
Example:
  const results = await searchLocation('Berlin');
  // [
  //   {
  //     display_name: 'Berlin, Germany',
  //     lat: '52.520008',
  //     lon: '13.404954',
  //     boundingbox: [...]
  //   }
  // ]
````

#### Get Address (Reverse Geocoding)

```typescript
async function getAddress(lat: number, lng: number): Promise<string>

Description: Reverse geocodes coordinates to address
API Endpoint: https://nominatim.openstreetmap.org/reverse
Parameters:
  - lat: Latitude
  - lng: Longitude
Returns: Formatted address string
Rate Limit: 1 request per second (Nominatim policy)
Example:
  const address = await getAddress(52.520008, 13.404954);
  // "Berlin, Germany"
```

---

## Data Types

### AOI Interface

```typescript
interface AOI {
  id: string; // UUID v4
  type: ShapeType; // 'point' | 'line' | 'polygon' | 'rectangle' | 'circle'
  name: string; // Default: "Polygon 1", "Point 1", etc.
  description: string; // Default: empty string
  coordinates: number[][] | number[][][]; // Depends on type
  color: string; // Hex color (default: #3b82f6)
  createdAt: string; // ISO 8601 timestamp
  radius?: number; // Only for circles (meters)
}
```

### Coordinate Formats by Type

**Point**:

```typescript
coordinates: [[lat, lng]];
// Example: [[51.505, -0.09]]
```

**Line**:

```typescript
coordinates: [[lat, lng], [lat, lng], ...]
// Example: [[51.505, -0.09], [51.51, -0.1]]
```

**Polygon/Rectangle**:

```typescript
coordinates: [[[lat, lng], [lat, lng], ..., [lat, lng]]]
// Note: First and last points must match (closed ring)
// Example: [[[51.5, -0.1], [51.51, -0.09], [51.509, -0.11], [51.5, -0.1]]]
```

**Circle**:

```typescript
coordinates: [[lat, lng]]; // Center point
radius: number; // Radius in meters
// Example: coordinates: [[51.508, -0.11]], radius: 500
```

---

## Proposed Backend API (Production)

### Base URL

```
https://api.aoi-app.com/v1
```

### Authentication

All API requests require JWT bearer token:

```
Authorization: Bearer <token>
```

---

### Endpoints

#### 1. List AOIs

```http
GET /aois

Description: Retrieve all AOIs for authenticated user
Authentication: Required
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 50, max: 100)
  - type: ShapeType (optional filter)
  - bbox: string (optional spatial filter: "minLat,minLng,maxLat,maxLng")
Response: 200 OK
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "aois": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "type": "polygon",
        "name": "Area 1",
        "description": "Important zone",
        "coordinates": [[[51.5, -0.1], [51.51, -0.09], ...]],
        "color": "#3b82f6",
        "createdAt": "2024-11-29T12:00:00.000Z",
        "updatedAt": "2024-11-29T12:00:00.000Z",
        "userId": "user123"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 50
  }
}
```

**Error Response**:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

#### 2. Get Single AOI

```http
GET /aois/:id

Description: Retrieve specific AOI by ID
Authentication: Required
Parameters:
  - id: string (UUID)
Response: 200 OK
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "polygon",
    "name": "Area 1",
    "description": "Important zone",
    "coordinates": [[[51.5, -0.1], ...]],
    "color": "#3b82f6",
    "area": 0.523,
    "createdAt": "2024-11-29T12:00:00.000Z",
    "updatedAt": "2024-11-29T12:00:00.000Z",
    "userId": "user123"
  }
}
```

**Error Response** (404):

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "AOI not found"
  }
}
```

---

#### 3. Create AOI

```http
POST /aois

Description: Create new AOI
Authentication: Required
Content-Type: application/json
Response: 201 Created
```

**Request Body**:

```json
{
  "type": "polygon",
  "name": "Area 1",
  "description": "Important zone",
  "coordinates": [
    [
      [51.5, -0.1],
      [51.51, -0.09],
      [51.509, -0.11],
      [51.5, -0.1]
    ]
  ],
  "color": "#3b82f6"
}
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "polygon",
    "name": "Area 1",
    "description": "Important zone",
    "coordinates": [[[51.5, -0.1], ...]],
    "color": "#3b82f6",
    "area": 0.523,
    "createdAt": "2024-11-29T12:00:00.000Z",
    "updatedAt": "2024-11-29T12:00:00.000Z",
    "userId": "user123"
  }
}
```

**Error Response** (400):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid coordinates format",
    "details": {
      "field": "coordinates",
      "reason": "First and last points must match for polygons"
    }
  }
}
```

---

#### 4. Update AOI

```http
PATCH /aois/:id

Description: Update existing AOI
Authentication: Required
Content-Type: application/json
Parameters:
  - id: string (UUID)
Response: 200 OK
```

**Request Body** (partial update):

```json
{
  "name": "Updated Area Name",
  "description": "New description"
}
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Updated Area Name",
    "description": "New description",
    "updatedAt": "2024-11-29T13:00:00.000Z"
    // ... other fields unchanged
  }
}
```

**Error Response** (403):

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to modify this AOI"
  }
}
```

---

#### 5. Delete AOI

```http
DELETE /aois/:id

Description: Delete AOI
Authentication: Required
Parameters:
  - id: string (UUID)
Response: 204 No Content
```

**Success Response**: Empty body with 204 status

**Error Response** (404):

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "AOI not found"
  }
}
```

---

#### 6. Bulk Create AOIs

```http
POST /aois/bulk

Description: Create multiple AOIs in single request
Authentication: Required
Content-Type: application/json
Response: 201 Created
```

**Request Body**:

```json
{
  "aois": [
    {
      "type": "point",
      "name": "Point 1",
      "coordinates": [[51.505, -0.09]]
    },
    {
      "type": "polygon",
      "name": "Area 1",
      "coordinates": [[[51.5, -0.1], ...]]
    }
  ]
}
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "created": 2,
    "failed": 0,
    "aois": [
      { "id": "...", ... },
      { "id": "...", ... }
    ]
  }
}
```

---

#### 7. Export AOIs (GeoJSON)

```http
GET /aois/export

Description: Export all AOIs as GeoJSON FeatureCollection
Authentication: Required
Query Parameters:
  - format: 'geojson' | 'kml' | 'shapefile' (default: geojson)
  - ids: string (comma-separated AOI IDs, optional)
Response: 200 OK
Content-Type: application/geo+json
```

**Success Response**:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[51.5, -0.1], ...]]
      },
      "properties": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Area 1",
        "description": "Important zone",
        "color": "#3b82f6",
        "createdAt": "2024-11-29T12:00:00.000Z"
      }
    }
  ]
}
```

---

#### 8. Import AOIs (GeoJSON)

```http
POST /aois/import

Description: Import AOIs from GeoJSON FeatureCollection
Authentication: Required
Content-Type: application/geo+json
Response: 201 Created
```

**Request Body**:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[51.5, -0.1], ...]]
      },
      "properties": {
        "name": "Imported Area"
      }
    }
  ]
}
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "imported": 1,
    "failed": 0,
    "aois": [
      { "id": "...", "name": "Imported Area", ... }
    ]
  }
}
```

---

#### 9. Search AOIs

```http
GET /aois/search

Description: Full-text search across AOI names and descriptions
Authentication: Required
Query Parameters:
  - q: string (search query)
  - limit: number (default: 20)
Response: 200 OK
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "...",
        "name": "Area 1",
        "description": "Contains 'search term'",
        "score": 0.95
      }
    ],
    "total": 1
  }
}
```

---

#### 10. Get Statistics

```http
GET /aois/stats

Description: Get statistics about user's AOIs
Authentication: Required
Response: 200 OK
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "total": 42,
    "byType": {
      "point": 10,
      "line": 5,
      "polygon": 20,
      "rectangle": 5,
      "circle": 2
    },
    "totalArea": 152.34,
    "createdToday": 3,
    "createdThisWeek": 12
  }
}
```

---

### Authentication Endpoints

#### 1. Register

```http
POST /auth/register

Description: Create new user account
Content-Type: application/json
Response: 201 Created
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "secure_password123",
  "name": "John Doe"
}
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-11-29T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### 2. Login

```http
POST /auth/login

Description: Authenticate user and get token
Content-Type: application/json
Response: 200 OK
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "secure_password123"
}
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400
  }
}
```

---

#### 3. Refresh Token

```http
POST /auth/refresh

Description: Get new token using refresh token
Content-Type: application/json
Response: 200 OK
```

**Request Body**:

```json
{
  "refreshToken": "refresh_token_here"
}
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "expiresIn": 86400
  }
}
```

---

## Error Codes

| Code                | HTTP Status | Description                       |
| ------------------- | ----------- | --------------------------------- |
| VALIDATION_ERROR    | 400         | Invalid request data              |
| UNAUTHORIZED        | 401         | Missing or invalid authentication |
| FORBIDDEN           | 403         | Insufficient permissions          |
| NOT_FOUND           | 404         | Resource not found                |
| CONFLICT            | 409         | Resource already exists           |
| RATE_LIMIT_EXCEEDED | 429         | Too many requests                 |
| INTERNAL_ERROR      | 500         | Server error                      |

---

## Rate Limiting

| Endpoint         | Limit               |
| ---------------- | ------------------- |
| Authentication   | 5 requests/minute   |
| Read Operations  | 100 requests/minute |
| Write Operations | 30 requests/minute  |
| Bulk Operations  | 10 requests/minute  |

---

## Webhooks (Future)

```http
POST /webhooks

Description: Register webhook for AOI events
Authentication: Required
```

**Events**:

- `aoi.created`
- `aoi.updated`
- `aoi.deleted`
- `aoi.shared`

---

**Last Updated**: November 29, 2024  
**API Version**: 1.0.0
