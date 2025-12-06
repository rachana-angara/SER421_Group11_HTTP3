# HTTP/2 & HTTP/3 Lab – Backend API Design

## 1. Health & Protocol

### 1.1 `GET /api/health`

**Purpose:** Simple health check for the backend.

- **Method:** `GET`
- **URL:** `/api/health`
- **Request body:** _None_
- **Response (200):**

```json
{
  "status": "ok"
}
```

### Playground / Protocol Racer endpoints

These endpoints are used by the `/playground` UI.

- `GET /api/resource/api/fast`  
  - Query parameters:
    - `protocol` – `"http2"` or `"http3"` (selected in the Playground).
    - `condition` – network condition id such as `"5g"`, `"wifi"`, `"slow3g"` (selected in the Network Condition modal).
    - `id` (optional) – numeric id when we want to retrieve a specific run.
  - Response (example):
    ```json
    {
      "protocol": "http3",
      "configuredDelayMs": 60,
      "measuredLatencyMs": 75,
      "id": 1,
      "type": "fast",
      "timestamp": "2025-12-05T04:26:33.548Z"
    }
    ```

These are the endpoints currently called by the Playground when you hit **Start Comparison / Start Simulation**.
