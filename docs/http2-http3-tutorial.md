# HTTP/2 & HTTP/3 Performance Tutorial with Protocol Racer

Author(s): Group 11  
Course: SER421 / SER598 – Web Applications  

---

## Table of Contents

1. [Introduction & Motivation](#1-introduction--motivation)  
2. [Learning Outcomes](#2-learning-outcomes)  
3. [Background: HTTP/1.1 → HTTP/2 → HTTP/3](#3-background-http11--http2--http3)  
4. [Tutorial Setup](#4-tutorial-setup)  
5. [Step-by-Step Learning Activities](#5-step-by-step-learning-activities)  
   - [5.1 Explore the Playground](#51-explore-the-playground)  
   - [5.2 Measure Base Latency](#52-measure-base-latency)  
   - [5.3 Compare HTTP2 vs HTTP3 Under Different Networks](#53-compare-http2-vs-http3-under-different-networks)  
   - [5.4 Inspect Resource Waterfalls](#54-inspect-resource-waterfalls)  
   - [5.5 Design Your Own Mini Experiment](#55-design-your-own-mini-experiment)  
6. [History and Standards](#6-history-and-standards)  
7. [Analysis: Is HTTP/3 Worth It?](#7-analysis-is-http3-worth-it)  
8. [References](#8-references)  
9. [Extra Learning Resources](#9-extra-learning-resources)  

---

## 1. Introduction & Motivation

Modern web apps are no longer a single HTML file and a few images. A typical page pulls in dozens of JavaScript bundles, CSS files, fonts, and API calls. How these resources travel over the network has a big impact on user-perceived performance.

HTTP/1.1, HTTP/2, and HTTP/3 all solve the same job (move web data from server to browser) but use very different strategies under the hood. This tutorial uses our **Protocol Racer** app to show, in a hands-on way, how those strategies affect latency, throughput, and overall page load behavior.

Our goal is that a student can open the project, run the playground, click through a set of guided activities, and walk away with both:

- practical skills (how to run performance experiments), and  
- a mental model of *why* HTTP/2 and HTTP/3 behave differently.

---

## 2. Learning Outcomes

By the end of this tutorial, a student should be able to:

1. Explain the main differences between HTTP/1.1, HTTP/2, and HTTP/3 in plain language.  
2. Describe the problems HTTP/2 and HTTP/3 are trying to solve (head-of-line blocking, connection setup cost, multiplexing limits).  
3. Run the Protocol Racer playground locally and perform a basic latency experiment.  
4. Compare HTTP/2 and HTTP/3 behavior under different network conditions (5G, WiFi, Slow 3G).  
5. Interpret simple performance metrics:
   - connection latency,  
   - number of concurrent streams,  
   - basic throughput numbers.  
6. Read a resource waterfall and point out visible protocol differences.  
7. Design and execute a small performance experiment (change one variable, collect results, draw a conclusion).  
8. Summarize the history and standards behind HTTP/2 and HTTP/3 at a high level.  
9. Form an opinion about the practical value of HTTP/3 today, backed by evidence from the literature and from the playground.

---

## 3. Background: HTTP/1.1 → HTTP/2 → HTTP/3

You don’t need to be a protocol expert for this tutorial, but it helps to have a rough picture:

### HTTP/1.1

- Text-based protocol.  
- One request per TCP connection by default.  
- Browsers open several parallel TCP connections to work around this.  
- Vulnerable to *head-of-line (HOL) blocking* at the HTTP layer.

### HTTP/2

- Still runs over TCP, but adds **multiplexing**: many streams over one connection.  
- Uses binary framing and header compression (HPACK).  
- Fixes HTTP-level HOL blocking, but still suffers from TCP-level HOL blocking when packets are lost.

### HTTP/3

- Runs on top of **QUIC** over UDP instead of plain TCP.  
- Streams are independent at the transport level, so a lost packet in one stream does not block all others.  
- Includes TLS-equivalent encryption by default and faster connection setup.

In the activities below, we will connect these ideas back to what you see in the Protocol Racer UI: latency numbers, number of streams, and waterfall shapes.

---

## 4. Tutorial Setup

This section summarizes how to get the project running. For full details, you can also see the repository `README.md`.

### 4.1 Prerequisites

- Java 17+  
- Maven  
- Node.js (LTS is fine) and npm  
- Git  

### 4.2 Start the Backend

From the `backend/` folder:

```bash
mvn clean package
mvn spring-boot:run

The backend will start on:
http://localhost:8080


Quick health check:
curl http://localhost:8080/api/health
# {"status":"ok"}

4.3 Start the Frontend
From the frontend/ folder:
npm install
npm run dev

Open the app in the browser:

http://localhost:5173/playground


You should see the Protocol Racer playground with a “Start Simulation” or “Start Comparison” button and network condition cards (5G, WiFi, Slow 3G).

5. Step-by-Step Learning Activities

This section is the core of the tutorial. Try to actually click through each step while reading.

5.1 Explore the Playground

Open http://localhost:5173/playground.

In the top-right mode selector, choose:

Mode: Comparison – HTTP/2 & HTTP/3.

Click Start Comparison to open the protocol and network selection dialogs.

Pick:

HTTP/2 or HTTP/3, and

a network condition (5G / WiFi / Slow 3G).

Spend a minute just looking at the UI:

Four metric cards (Latency, Multiplexing Streams, Header Compression, Throughput).

A Network Condition card on the left.

A Live Chart / Waterfall section below.

We will use these elements in each activity.

5.2 Measure Base Latency

Goal: get a feel for “normal” latency under a good network.

Select HTTP/2 and 5G in the playground.

Click Start Simulation.

Open DevTools in the browser and look at the console.
You should see a log similar to:

simulation result from backend: { endpointType: 'fast', latencyMs: 68, protocol: 'http2', ... }

Note the latency shown in the Latency card.

Repeat the run a few times and note how much it varies.

You can record results in a simple table:

Run	Protocol	Network	Latency (ms)
1	HTTP/2	5G	
2	HTTP/2	5G	
3	HTTP/2	5G	

Questions:

How far is the measured latency from the “ideal” latency printed in the network condition card?

Does latency fluctuate between runs even when nothing else changes?

5.3 Compare HTTP2 vs HTTP3 Under Different Networks

Goal: see how protocol behavior changes when the network gets worse.

Start with HTTP/2 + WiFi:

Run 3–5 simulations.

Note latency and any changes in throughput.

Switch to HTTP/3 + WiFi:

Run 3–5 simulations with the same network condition.

Repeat the pair for Slow 3G.

You now have three sets of numbers:

HTTP/2 vs HTTP/3 on WiFi

HTTP/2 vs HTTP/3 on Slow 3G

Earlier runs on 5G from the previous section

Look for patterns:

Under which network does HTTP/3 show more benefit?

Do you ever see outliers where HTTP/3 is worse?

How big are the differences compared to normal variability?

Relate this back to protocol design:

On “clean” networks (like good WiFi), TCP’s head-of-line blocking hurts less.

On lossy networks (Slow 3G), independent streams in QUIC can help keep other resources moving.

5.4 Inspect Resource Waterfalls

Goal: relate raw numbers to actual resource loading patterns.

Pick one scenario, for example HTTP/2 + WiFi.

Run a simulation and scroll down to the Live Chart / Waterfall area.

Observe:

how many resources are requested,

which ones start first,

whether multiple bars overlap (concurrency).

Switch to HTTP/3 + WiFi, use the same network condition, and run again.

Compare the waterfalls.

Things to notice:

Is one protocol able to start more resources sooner?

Do you see evidence of multiplexing (many overlapping bars on one connection)?

How does the total “height” or overall time of the waterfall compare between protocols?

You can take screenshots and annotate them for your report or slides.

5.5 Design Your Own Mini Experiment

Goal: practice designing a simple performance experiment, not just clicking buttons.

Pick a question such as:

“Does HTTP/3 help more when I increase the number of resources?”

“How does performance change if I switch from 5G to Slow 3G while staying on HTTP/3?”

“Is the difference between HTTP/2 and HTTP/3 larger on the first run (cold connection) or on repeated runs (warm connection)?”

Then:

Write down a hypothesis in one sentence.

Example: “On Slow 3G, HTTP/3 will have lower average latency than HTTP/2.”

Decide what you will measure (for example, latencyMs from the simulation result, or time until the waterfall finishes).

Run enough simulations to get a small data set (for example, 10 runs per case).

Put your data into a small table or spreadsheet.

Compute simple summary numbers (average, maybe min / max).

Write a short paragraph describing what you saw. Did the data support your hypothesis?

This small experiment can be reused directly in your project report and in the analytical section.

6. History and Standards

Here is a short history of the protocols we are using:

HTTP/0.9 and HTTP/1.0

Very simple text-based protocols from the early web.

One request per TCP connection.

HTTP/1.1

Standardized in RFC 2068 and RFC 2616, later updated by RFC 7230 and related RFCs.

Added persistent connections and pipelining, but browsers mostly avoided pipelining due to HOL blocking issues.

Browsers instead opened multiple parallel TCP connections per origin.

SPDY and HTTP/2

Google’s SPDY experiment showed that multiplexing and header compression could substantially reduce latency.

The IETF HTTP Working Group took many SPDY-inspired ideas and produced HTTP/2, standardized in RFC 7540 (2015).

QUIC and HTTP/3

Google QUIC started as an experiment to replace TCP + TLS with a faster encrypted transport over UDP.

The IETF QUIC Working Group standardized QUIC transport in RFC 9000 and related RFCs.

HTTP over QUIC was renamed HTTP/3 and standardized in RFC 9114 (2022).

Key standards organizations:

IETF (Internet Engineering Task Force) – defines the protocol RFCs.

W3C (World Wide Web Consortium) – focuses on browser APIs and the web platform, closely related to HTTP’s evolution.

7. Analysis: Is HTTP/3 Worth It?

This section is where the team expresses an opinion, not just a summary. Adjust the wording as needed to match your own results.

7.1 Observations from Protocol Racer

From our experiments in the playground, we saw:

On good networks (5G, solid WiFi), HTTP/3 was often only slightly faster than HTTP/2, sometimes within noise.

On Slow 3G or when simulated latency was high, HTTP/3 tended to show more stable performance and slightly lower average latency.

The waterfall for HTTP/3 runs often felt smoother: resources started quickly and did not stall as much when the network was lossy.

These observations match many production reports: HTTP/3 is not a magic bullet, but it helps most in rough network conditions.

7.2 Pros

Better behavior on lossy networks due to QUIC’s stream independence.

Faster connection setup (fewer round trips), which helps first-time visitors.

Encryption built in; there is no unencrypted variant.

7.3 Cons and Challenges

More complex server implementation and operational tooling.

Some middleboxes and older networks still have issues with UDP traffic.

For many desktop users on good broadband, the performance difference may be small.

7.4 Overall Take

Our opinion:

For a modern public-facing web service, enabling HTTP/2 should be considered the minimum baseline.

HTTP/3 is worth enabling when your infrastructure and hosting provider support it, especially if you have many mobile users or global traffic.

However, it does not replace the basics: caching, good API design, bundling, and minimizing unnecessary requests.

You should adapt this section to reflect your own measurements and the articles you read, and cite those sources in the reference list.

8. References

These are example references you can expand or adjust. Use any reasonable citation style; the key is to link each reference where you use it.

M. Belshe, R. Peon, M. Thomson, “Hypertext Transfer Protocol Version 2 (HTTP/2),” RFC 7540, IETF, 2015.

M. Bishop, “HTTP/3,” RFC 9114, IETF, 2022.

J. Iyengar, M. Thomson, “QUIC: A UDP-Based Multiplexed and Secure Transport,” RFC 9000, IETF, 2021.

MDN Web Docs, “An overview of HTTP,” Mozilla Developer Network.

Cloudflare Blog, “HTTP/3: the past, the present, and the future,” Cloudflare.

Google Developers, “Introduction to QUIC,” Chromium / web.dev article.

(Replace or extend this list with the actual sources you used.)

9. Extra Learning Resources

These are optional resources for readers who want to go deeper:

MDN HTTP documentation – gentle introductions to HTTP basics and advanced topics.

HTTP/2 and HTTP/3 posts from major CDNs (Cloudflare, Fastly, Akamai) – real-world deployment stories.

Wireshark / Chrome DevTools tutorials – to inspect actual HTTP/2 and HTTP/3 traffic.

Talks from conferences (Google I/O, etc.) on QUIC and HTTP/3.

Readers can use these to extend the tutorial into their own experiments or projects.