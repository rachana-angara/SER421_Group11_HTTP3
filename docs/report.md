# Protocol Racer: An Interactive Tutorial and Lab on HTTP/2 and HTTP/3

Course: SER 421  
Team: Group 11  
Topic: HTTP/2 and HTTP/3

---

## Table of Contents

1. Introduction
2. Learning Outcomes
3. Background and History  
   3.1 HTTP/1.1 and its limitations  
   3.2 HTTP/2  
   3.3 HTTP/3 and QUIC
4. System Design and Implementation  
   4.1 Backend: Resource Simulation API  
   4.2 Frontend: Protocol Racer SPA  
   4.3 Proxy and Protocol Setup with Caddy
5. Tutorial Flow and Labs  
   5.1 Learn Page  
   5.2 Playground and Visualization  
   5.3 Labs 1 to 4
6. Experimental Results and Analytical Discussion  
   6.1 Measurement Methodology  
   6.2 Observations from Labs  
   6.3 Pros, Cons, and Future Potential of HTTP/3
7. Reproducibility and Setup
8. References
9. Additional Resources

---

## 1. Introduction

The web has evolved from serving simple static HTML documents to delivering complex, JavaScript heavy single page applications. As pages became richer and heavier, the original design of HTTP/1.1 started to show performance limitations, especially around connection management, latency, and head-of-line blocking.

HTTP/2 and HTTP/3 are major evolutions of the HTTP protocol family that aim to solve these issues while keeping the same request and response model used by web developers. HTTP/2 introduces multiplexed streams and header compression over TCP. HTTP/3 runs HTTP over QUIC, a transport protocol built on UDP that can avoid some of TCP's head-of-line blocking and enable faster connection setup.

This project implements an interactive tutorial and lab environment called **Protocol Racer** to help learners:

- Understand the motivation and design of HTTP/2 and HTTP/3.
- See these protocols in action in DevTools.
- Run small experiments and connect measurements to the concepts discussed in SER 421.

Our deliverables include:

- A web based tutorial with pages for Learn, Playground, Labs, and Setup.
- A working demo of HTTP/2 and HTTP/3 using a Spring Boot backend and a Caddy reverse proxy.
- A set of guided labs.
- An analytical discussion of the utility of HTTP/3 compared to HTTP/2, supported by experimental observations.

---

## 2. Learning Outcomes

By the end of this tutorial and lab, a learner should be able to:

1. **Identify** key performance limitations of HTTP/1.1, particularly around connection limits and head-of-line blocking.
2. **Describe** how HTTP/2 uses binary framing, streams, and multiplexing over a single TCP connection.
3. **Explain** how HTTP/3 and QUIC avoid transport level head-of-line blocking and provide faster connection setup in some scenarios.
4. **Compare and contrast** HTTP/1.1, HTTP/2, and HTTP/3 using both conceptual features and simple experimental results.
5. **Run and interpret** basic performance experiments using our Protocol Racer Playground and a browser's DevTools Network panel.
6. **Formulate an opinion**, backed by evidence, on when HTTP/3 provides a meaningful benefit over HTTP/2 and when HTTP/2 is sufficient.

These outcomes align with SER 421 goals related to web architectures, protocols, and performance behavior of modern web systems.

---

## 3. Background and History

### 3.1 HTTP/1.1 and its limitations

Early HTTP versions such as HTTP/0.9 and HTTP/1.0 assumed one TCP connection per request and response. HTTP/1.1 introduced persistent connections and optional pipelining so that multiple requests could reuse a connection.

However, modern web pages often include tens or hundreds of separate resources. Typical HTTP/1.1 behavior in browsers includes:

- Opening multiple TCP connections per origin (often six connections) to parallelize requests.
- Paying extra cost for each TCP handshake and TCP congestion window warmup.
- Suffering from head-of-line blocking when pipelining is used: a slow response can block subsequent responses on the same connection.
- Sending uncompressed headers on every request, including large cookies.

As sites grew larger and more interactive, these limitations increased page load times, particularly on mobile and high-latency networks.

### 3.2 HTTP/2

HTTP/2 keeps the semantics of HTTP but changes how messages are framed and sent over the network.

Key design points of HTTP/2:

- A single TCP connection per origin is typically used for all requests.
- Each HTTP request and response pair is assigned a **stream ID**. Streams are logical channels multiplexed over one TCP connection.
- Data is carried in **frames**, which are small binary chunks tagged with a stream ID and type. Frames from different streams can be interleaved.
- Header compression is provided by **HPACK**, which uses static and dynamic tables to efficiently encode header fields.
- Server push allows the server to send resources before the client explicitly requests them.

Multiplexing solves application level head-of-line blocking between requests on the same connection, since frames from different streams can be interleaved. However, HTTP/2 still sits on top of TCP, so loss of a single TCP segment can block the delivery of data for all streams until the missing data is retransmitted.

### 3.3 HTTP/3 and QUIC

HTTP/3 takes the HTTP/2 ideas of streams and frames and runs them over **QUIC** rather than TCP.

Characteristics of QUIC and HTTP/3:

- QUIC is built on top of UDP. All reliability, congestion control, and stream management are implemented in user space libraries, not in the kernel.
- QUIC provides multiple independent streams at the transport layer. Loss on one stream does not necessarily block progress on other streams, which reduces transport level head-of-line blocking.
- TLS is integrated into QUIC, and connection resumption can be faster than with TCP plus TLS.
- HTTP/3 uses **QPACK**, a header compression scheme adapted to HTTP/3's different ordering and reliability guarantees.

HTTP/3 is not a guaranteed "magic speed boost" in all conditions, but it is designed to be more robust under packet loss, mobile network changes, and real world Internet conditions.

---

## 4. System Design and Implementation

Our system consists of three main components:

1. A Spring Boot backend that simulates various resource types and delays.
2. A React based single page application called Protocol Racer.
3. A Caddy reverse proxy that serves the frontend and backend under three different protocol configurations.

### 4.1 Backend: Resource Simulation API

The backend is a Spring Boot application running on `http://localhost:8080`. It exposes endpoints under the `/api` prefix:

- `GET /api/health` returns a simple JSON status object such as `{"status":"ok"}`.
- `GET /api/protocol` returns the HTTP protocol string observed on the server (for example `"HTTP/1.1"` or `"HTTP/2.0"`).
- `GET /api/resource/css` simulates loading a CSS file by sleeping for a short time and returning synthetic CSS content of configurable size.
- `GET /api/resource/js` simulates loading a JavaScript file.
- `GET /api/resource/image` simulates loading an image by returning a byte array of the requested size.
- `GET /api/resource/api/fast` simulates a fast API call. It takes query parameters such as `protocol` and `condition` and uses them to compute a latency, then sleeps for that duration and returns metadata including `configuredDelayMs` and `measuredLatencyMs`.
- `GET /api/resource/api/slow` simulates a slow API call by sleeping for around two seconds and returning metadata.

These endpoints are deliberately simple. They are designed to support teaching by providing predictable behavior for the Playground and Labs, rather than modeling real business logic.

### 4.2 Frontend: Protocol Racer SPA

The frontend is implemented using React, TypeScript, and Vite. It is organized into pages and components:

- **Navbar** provides navigation links to the main pages: Home, Learn, Playground, Labs, and Setup.
- **Home** introduces the project and invites users to "Start Comparison" or "Start Tutorial". It also explains how the site is structured.
- **Learn** is a long-form tutorial page that covers the history of HTTP, the performance problems of HTTP/1.1, HTTP/2's binary framing and multiplexing, HTTP/3 and QUIC, and includes a side by side feature table for HTTP/1.1, HTTP/2, and HTTP/3.
- **Playground** is the interactive comparison area. It lets users choose a protocol (HTTP/2 or HTTP/3), choose a network condition (5G, WiFi, Slow 3G, or a custom configuration), and run a simulation. The simulation calls the backend fast API endpoint and uses the result along with configured parameters to drive metric cards and a waterfall-like visualization.
- **Labs** describes Labs 1 through 4, each with goals and step by step instructions. For some steps, the Labs page includes buttons that pre-fill the Playground via query parameters (for example `?protocol=http3&condition=wifi`).
- **Setup** summarizes how to run the backend, build the frontend, and configure Caddy. It mirrors the more detailed text in `docs/protocol-setup.md`.

The Visualization view in the Playground shows:

- Metric cards for latency, number of multiplexed streams, header compression efficiency, and throughput.
- A waterfall chart where each bar is composed of segments representing phases such as DNS, TCP, SSL, request, wait, and response.
- Phase statistics that summarize average, minimum, and maximum times for each phase across all simulated requests.

This view is not doing packet-level measurement. Instead, it combines backend simulated latency with front-end logic to produce a plausible representation of how protocol and network settings affect perceived performance.

### 4.3 Proxy and Protocol Setup with Caddy

To compare HTTP/1.1, HTTP/2, and HTTP/3 using the same application code, we use Caddy as a reverse proxy and static file server. The backend always listens on `localhost:8080`. The React app is built into `frontend/dist`.

Caddy is configured with three sites:

- `http://http1.localhost:8081`  
  Serves the React build as static files and proxies `/api/*` to `http://localhost:8080`. This site does not use TLS and therefore uses HTTP/1.1.

- `https://h2.localhost:8443`  
  Uses `tls internal` so that Caddy generates a local self-signed certificate. The browser typically negotiates HTTP/2 (`h2`) for this site. It serves the same static frontend and proxies `/api/*` to `http://localhost:8080`.

- `https://h3.localhost:9443`  
  Also uses internal TLS and offers HTTP/2 and HTTP/3 over QUIC. Modern browsers will use HTTP/3 (`h3`) when possible and fall back to HTTP/2 if needed.

All three sites share:

- `root` pointing to `frontend/dist`.
- `file_server` to serve static assets.
- `reverse_proxy /api/* http://localhost:8080` to forward API calls.

This arrangement isolates protocol differences at the proxy layer. Neither the backend nor the frontend needs to know which HTTP protocol version is used. To run experiments, students simply open the same application at different origins and observe the protocol column in DevTools or the behavior of the Playground.

On our Windows environment, the built in `curl` supports HTTP/1.1 but not the `--http2` or `--http3` flags. We therefore use `curl -v http://http1.localhost:8081/api/health` to demonstrate HTTP/1.1 through Caddy and rely on the browser's DevTools Network panel to observe HTTP/2 and HTTP/3.

---

## 5. Tutorial Flow and Labs

### 5.1 Learn Page

The Learn page provides the conceptual foundation for the labs and simulations. It includes:

- A list of learning outcomes, so students know what they should be able to do at the end.
- A short history of HTTP, focusing on how the protocol evolved from simple document retrieval to handling complex web applications.
- A section on performance problems in HTTP/1.1, including multiple connections per origin, inefficient header handling, and head-of-line blocking.
- A section on HTTP/2, explaining streams, frames, multiplexing, and HPACK header compression.
- A section on HTTP/3 and QUIC, explaining UDP based transport, independent streams, faster handshakes, and QPACK.
- A side by side comparison table for HTTP/1.1, HTTP/2, and HTTP/3 that lists transport, connections per origin, multiplexing, head-of-line blocking behavior, and header compression scheme.

Throughout the page, we reference concepts taught in SER 421, such as TCP behavior, congestion control, and browser DevTools.

### 5.2 Playground and Visualization

The Playground is the main interactive component. The typical flow is:

1. The user chooses a protocol (HTTP/2 or HTTP/3).
2. The user chooses a network condition preset such as 5G, WiFi, or Slow 3G, or configures a custom latency, bandwidth, and packet loss level.
3. The user clicks "Start Simulation".
4. The frontend calls the backend `api/fast` endpoint with the chosen protocol and condition. The backend returns a latency measurement.
5. The frontend uses this latency, along with the protocol and network settings, to generate a set of simulated requests for different resource types. These requests are used to populate the waterfall visualization and metric cards.

The Visualization page displays:

- Latency in milliseconds.
- An approximate number of multiplexed streams (higher for HTTP/3 in our UI).
- A header compression efficiency percentage.
- Throughput in Mbps based on the selected network condition.

The waterfall chart helps students see the relationship between initial connection costs (DNS, TCP, SSL) and later phases (request, wait, response), and how these phases change under different conditions.

The Playground also reads query parameters from the URL. For example, `/playground?lab=lab2&protocol=http3&condition=wifi` will pre-select HTTP/3, a WiFi-like network condition, and jump directly into the visualization view. The Labs page uses this feature to provide "Open scenario in Playground" buttons for specific steps.

### 5.3 Labs 1 to 4

The Labs are scripted activities that connect the Learn page concepts to hands-on work.

- **Lab 1: Environment and Protocol Sanity Check**  
  Students:
    - Run the backend and Caddy.
    - Configure the hosts file so that `http1.localhost`, `h2.localhost`, and `h3.localhost` resolve to `127.0.0.1`.
    - Use DevTools to enable the Protocol column in the Network panel.
    - Visit each host and confirm that `http1.localhost` uses `http/1.1`, `h2.localhost` uses `h2`, and `h3.localhost` uses `h3` or falls back to `h2`.  
      Students capture screenshots of the Network panel for each host and summarize the results.

- **Lab 2: Comparing HTTP/2 and HTTP/3 Latency**  
  Students:
    - Use the Playground over both HTTP/2 and HTTP/3 hosts.
    - For a given network condition (for example WiFi), run simulations and record latency metrics.
    - Repeat the experiment under a slower condition (Slow 3G).
    - Compare the latency results and discuss whether HTTP/3 shows any advantage under these simulated conditions.

- **Lab 3: Network Conditions and Throughput**  
  Students:
    - Run simulations for several network presets (5G, WiFi, Slow 3G) under one protocol.
    - Record latency and throughput for each run.
    - Repeat with the other protocol.
    - Compare trends, looking for how worsening network conditions affect each protocol.

- **Lab 4: Protocol Tradeoffs and Analysis**  
  Students:
    - Review their data and screenshots from Labs 1 to 3.
    - Select at least one scenario where HTTP/3 clearly outperformed HTTP/2 and one where the difference was minor.
    - Write a one to two page reflection on the tradeoffs among HTTP/1.1, HTTP/2, and HTTP/3, using their measurements as evidence.  
      This written reflection is the core of the analytical component for the project.

---

## 6. Experimental Results and Analytical Discussion

### 6.1 Measurement Methodology

Our measurements are designed for teaching, not for production benchmarking. The methodology is:

- Use the same backend and frontend code for all protocols.
- Only change which origin the browser uses:
    - `http1.localhost:8081` for HTTP/1.1.
    - `h2.localhost:8443` for HTTP/2.
    - `h3.localhost:9443` for HTTP/3 when available.
- Use DevTools to confirm which protocol is negotiated.
- Use our Playground to generate repeatable simulations under various network conditions and to provide latency and throughput metrics.

We rely heavily on DevTools because the Windows `curl` binary in our environment does not support the `--http2` or `--http3` flags. This limitation itself is an interesting data point about real world tooling.

### 6.2 Observations from Labs

From Lab 1, we confirmed that our environment exposes different protocols as intended:

- `http://http1.localhost:8081` displayed `http/1.1` in the Protocol column.
- `https://h2.localhost:8443` displayed `h2`, confirming HTTP/2.
- `https://h3.localhost:9443` displayed `h3` when HTTP/3 was available, or `h2` when HTTP/3 was not negotiated, demonstrating that HTTP/3 support depends on browser and network conditions.

In Lab 2, we compared HTTP/2 and HTTP/3 latency using the fast API simulation. Qualitatively:

- Under a WiFi-like condition, HTTP/2 and HTTP/3 latency values were similar. This matches expectations from the literature that on high quality networks, HTTP/2 and HTTP/3 often perform similarly.
- Under a slower, higher latency condition such as Slow 3G, the differences became more noticeable. While our simulations are coarse, some runs suggested that HTTP/3 produced slightly more stable latency, consistent with QUIC's design to reduce the impact of loss.

In Lab 3, we examined throughput and latency as we changed network presets. Expectedly, throughput was dominated by the bandwidth setting in the presets, while protocol choice affected how initial and wait phases appeared in the waterfall and how sensitive latency was to poor conditions.

These observations are not definitive benchmarks, but they provide concrete examples that students can refer to when discussing HTTP/3.

### 6.3 Pros, Cons, and Future Potential of HTTP/3

Based on our reading and hands-on work, we arrived at the following view.

**Pros of HTTP/3:**

- Reduced transport level head-of-line blocking due to independent streams in QUIC.
- Faster connection setup in some cases because TLS is integrated and connection resumption can be cheaper.
- Connection migration, which can be important for mobile devices moving between networks.
- Potential for faster evolution because QUIC runs in user space.

**Cons and challenges:**

- Deployment complexity. HTTP/3 and QUIC require updated proxies, load balancers, and firewall rules.
- Tooling and ecosystem support are still catching up. Our experience with curl on Windows, which did not support `--http2` or `--http3`, is one example.
- Benefits may be marginal in highly optimized, low-latency environments, making HTTP/2 a perfectly acceptable default for many use cases.

Our opinion is that HTTP/3 is a promising and likely durable evolution of the web transport stack, particularly valuable for mobile and lossy networks, but that it will coexist with HTTP/2 for a long time. For many applications, moving from HTTP/1.1 to HTTP/2 already delivers substantial gains, and the incremental benefit of HTTP/3 depends on network and workload characteristics.

---

## 7. Reproducibility and Setup

To reproduce our environment and re-run the tutorial and labs:

1. Install Java 17, Maven, Node.js, and Caddy on a machine running Windows 10 or 11.
2. Edit the Windows hosts file at `C:\Windows\System32\drivers\etc\hosts` and add:
   ```text
   127.0.0.1  http1.localhost
   127.0.0.1  h2.localhost
   127.0.0.1  h3.localhost
