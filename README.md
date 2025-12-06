# SER421 – HTTP/2 vs HTTP/3 Protocol Racer

An interactive web app that compares HTTP/2 and HTTP/3 performance.  
The Playground UI lets you pick a protocol and network condition (5G, WiFi, Slow 3G), then visualizes latency, multiplexing, header compression, and throughput using real backend timings.

---

## 1. Project Overview

This project was built as part of **SER421 – Advanced Web Development** to demonstrate modern web transport protocols.

The system has:

- A **Spring Boot backend** that exposes simple REST endpoints for:
  - Health checks
  - “Fast” resource requests with configurable latency
  - Static assets (CSS, JS, images) to simulate multiplexing
- A **React + Vite frontend** (“Protocol Racer”) that:
  - Calls the backend APIs
  - Measures real response times
  - Renders metric cards and a waterfall chart for HTTP/2 vs HTTP/3

---

## 2. Tech Stack

- **Backend:** Java, Spring Boot, Maven  
- **Frontend:** React, TypeScript, Vite, Tailwind CSS  
- **Protocols:** HTTP/1.1 (dev only), HTTP/2, HTTP/3 (via browser + server config)

---

## 3. Running the Project Locally

### 3.1 Prerequisites

- Java 17+  
- Maven  
- Node.js + npm  

### 3.2 Start the Backend

From the `backend/` folder:

    mvn clean package
    mvn spring-boot:run

The backend will start on:

    http://localhost:8080

Quick health check:

    curl http://localhost:8080/api/health
    # {"status":"ok"}

### 3.3 Start the Frontend

From the `frontend/` folder:

    npm install
    npm run dev

Open the app in the browser:

    http://localhost:5173/playground

The Vite dev server proxies `/api/*` to `http://localhost:8080`.

---

## 4. Backend API Summary

### 4.1 `GET /api/health`

Simple connectivity check used by the Playground.

- Response 200 (OK):

      { "status": "ok" }

If the backend throws an exception, the Playground shows a red error banner.

### 4.2 `GET /api/resource/api/fast`

Simulates a “fast” resource with configurable latency.

- Query params:
  - `protocol` – `"http2"` or `"http3"`
  - `condition` – optional network condition id, e.g. `"5g"`, `"wifi"`, `"slow3g"`
  - `id` – optional numeric id used by the UI

- Example response:

      {
        "protocol": "http3",
        "configuredDelayMs": 60,
        "measuredLatencyMs": 72,
        "id": 1,
        "type": "fast",
        "timestamp": "2025-12-05T21:08:21.123Z"
      }

The frontend uses `measuredLatencyMs` to update the metric cards and waterfall chart.

(Other static resource endpoints for CSS, JS, and images are used to show multiplexing behavior.)

---

## 5. Using the Playground

1. Open `http://localhost:5173/playground`.  
2. Click **Start Comparison**.  
3. Select:
   - A protocol pair: **HTTP/2 & HTTP/3**
   - A network condition: **5G / WiFi / Slow 3G**  
4. Click **Start Simulation**.  
5. Observe:
   - Latency, header compression, and throughput cards updating
   - Waterfall chart driven by real backend timings  
6. Switch network conditions or protocols and re-run to compare.

---

## 6. Documentation

Additional endpoint and design details are in:

    docs/api-design.md

