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
