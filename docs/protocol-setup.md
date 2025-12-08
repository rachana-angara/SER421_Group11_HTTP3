# Protocol and Proxy Setup for HTTP/1.1, HTTP/2, and HTTP/3

This document explains how to run the Spring Boot backend, build the React frontend, and serve everything through Caddy using three different protocols.

- http1.localhost:8081  → HTTP/1.1 (no TLS)
- h2.localhost:8443     → HTTPS (HTTP/2)
- h3.localhost:9443     → HTTPS (HTTP/2 / HTTP/3 capable)

## 1. Prerequisites

- Java 17 and Maven
- Node.js and npm
- Caddy installed and available on PATH
- A modern browser with DevTools (Chrome, Edge, Firefox)
- Windows hosts file updated to include:

```text
127.0.0.1  http1.localhost
127.0.0.1  h2.localhost
127.0.0.1  h3.localhost
