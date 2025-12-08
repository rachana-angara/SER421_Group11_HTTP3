# Protocol & Proxy Setup: HTTP/1.1, HTTP/2, HTTP/3

This document explains how to run the backend, build the frontend, and serve everything through Caddy on three different hostnames:

- `http1.localhost:8081` → HTTP/1.1 (no TLS)
- `h2.localhost:8443` → HTTPS (HTTP/2)
- `h3.localhost:9443` → HTTPS (HTTP/2 / HTTP/3 capable)

These steps are what the Labs and Setup page refer to.

---

## 1. Prerequisites

Install the following:

- Java 17+
- Maven
- Node.js and npm
- Caddy (available on PATH)
- Modern browser (Chrome, Edge, or Firefox)

### 1.1 Hosts file entries (Windows)

Edit `C:\Windows\System32\drivers\etc\hosts` as Administrator and make sure the following lines are present (and **not** commented):

```text
127.0.0.1  http1.localhost
127.0.0.1  h2.localhost
127.0.0.1  h3.localhost
