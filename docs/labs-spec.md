# HTTP/2 & HTTP/3 Labs Specification

These labs connect the Learn page concepts to hands-on experiments in the Playground and browser DevTools.

All labs assume:

- Backend is running on `http://localhost:8080`
- Frontend has been built (`npm run build`)
- Caddy is serving:

    - `http://http1.localhost:8081`
    - `https://h2.localhost:8443`
    - `https://h3.localhost:9443`

---

## Lab 1 – Environment & Protocol Sanity Check

Goal: Confirm that HTTP/1.1, HTTP/2, and HTTP/3 are all reachable in the local environment.

Steps:

1. Follow `docs/protocol-setup.md`:
    - Start the Spring Boot backend.
    - Build the frontend.
    - Run Caddy with the provided Caddyfile.

2. Open Chrome DevTools → Network tab → enable the **Protocol** column.

3. Visit each host:

    - `http://http1.localhost:8081`
    - `https://h2.localhost:8443`
    - `https://h3.localhost:9443`

4. For each host:

    - Reload with "Disable cache" checked.
    - Observe values in the Protocol column.
    - Take a screenshot of the Network panel.

5. Optional: call `/api/protocol` on each host and note the returned `protocol` field.

Deliverable:

- Three screenshots of the Network panel (one per host).
- A short paragraph summarizing which protocol was used by each host.

---

## Lab 2 – Comparing HTTP/2 and HTTP/3 Latency

Goal: Use the Playground simulations to compare the latency behavior of HTTP/2 vs HTTP/3.

Steps:

1. Open the Playground via the Labs page preset (this will prefill protocol and network condition) or manually:

    - HTTP/2 run: `https://h2.localhost:8443/playground`
    - HTTP/3 run: `https://h3.localhost:9443/playground`

2. For both runs, use the same network condition (for example, a WiFi-like preset).

3. In each case:

    - Choose protocol (HTTP/2 or HTTP/3).
    - Confirm the selected network condition.
    - Click "Start Simulation".

4. Record for each protocol:

    - Latency value from the Metric card.
    - Any notes about the waterfall shape and distribution of phases (DNS, TCP, SSL, wait, response).

5. Repeat the experiment under a slower network condition (for example, Slow 3G) and record the same metrics.

Deliverable:

- A table with columns: Protocol, Network Condition, Latency.
- A short explanation of whether HTTP/3 appears more stable or lower in latency based on your runs.

---

## Lab 3 – Network Conditions and Throughput

Goal: Understand how simulated network conditions affect throughput and latency for HTTP/2 and HTTP/3.

Steps:

1. Open the Playground over HTTP/3:

    - `https://h3.localhost:9443/playground`

2. Select HTTP/3 and run simulations under at least three conditions:

    - 5G
    - WiFi
    - Slow 3G

3. For each condition, after clicking "Start Simulation":

    - Record latency.
    - Record throughput.
    - Note any visible patterns in the waterfall (for example, longer waits, larger response times).

4. Repeat the same set of conditions over HTTP/2:

    - `https://h2.localhost:8443/playground`

Deliverable:

- A table with rows like: [Protocol, Condition, Latency, Throughput].
- A paragraph discussing how worse network conditions amplify differences between HTTP/2 and HTTP/3.

---

## Lab 4 – Protocol Tradeoffs & Analysis

Goal: Synthesize findings from Labs 1–3 and form an opinion on when HTTP/3 is a meaningful improvement over HTTP/2.

Steps:

1. Review your data and screenshots from Labs 1–3.

2. Choose one scenario where HTTP/3 clearly performed better than HTTP/2, and one scenario where the difference was small.

3. For each scenario:

    - Describe the setup (protocol, network condition).
    - Include or reference the metric values you measured.

4. Answer the following questions:

    - Under what conditions does HTTP/3 provide a noticeable benefit over HTTP/2?
    - When does HTTP/2 seem “good enough”?
    - What deployment or tooling issues could slow HTTP/3 adoption in real systems?

Deliverable:

- A one to two page written reflection using your lab data as evidence.
- This written analysis contributes directly to the analytical component of the project report.
