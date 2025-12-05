export default function Learn() {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-200 space-y-10">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Learn HTTP/1.1, HTTP/2, and HTTP/3
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl">
          This tutorial explains why HTTP evolved and how HTTP/2 and HTTP/3
          improve page load performance. The concepts here are what you will
          test in the Playground and Labs.
        </p>
      </header>

      {/* Learning Outcomes */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          Learning Outcomes
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Identify key performance limitations of HTTP/1.1.</li>
          <li>
            Describe how HTTP/2 uses binary framing, streams, and multiplexing.
          </li>
          <li>
            Explain how HTTP/3 and QUIC avoid head-of-line blocking at the
            transport layer.
          </li>
          <li>
            Compare HTTP/1.1, HTTP/2, and HTTP/3 using a simple feature
            checklist.
          </li>
        </ul>
      </section>

      {/* Table of contents */}
      <section className="bg-slate-900/40 border border-slate-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-3">
          On this page
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm sm:text-base">
          <li>
            <a href="#history" className="hover:text-white">
              1. A quick history of HTTP
            </a>
          </li>
          <li>
            <a href="#problems" className="hover:text-white">
              2. Performance problems in HTTP/1.1
            </a>
          </li>
          <li>
            <a href="#http2" className="hover:text-white">
              3. HTTP/2: binary framing and multiplexing
            </a>
          </li>
          <li>
            <a href="#http3" className="hover:text-white">
              4. HTTP/3: QUIC and streams over UDP
            </a>
          </li>
          <li>
            <a href="#compare" className="hover:text-white">
              5. Side-by-side comparison table
            </a>
          </li>
          <li>
            <a href="#next" className="hover:text-white">
              6. Connecting to the Playground & Labs
            </a>
          </li>
          <li>
            <a href="#refs" className="hover:text-white">
              7. References & further reading
            </a>
          </li>
        </ul>
      </section>

      {/* 1. History */}
      <section id="history" className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          1. A quick history of HTTP
        </h2>
        <p className="text-gray-300 max-w-3xl">
          HTTP started as a very simple protocol. Early versions (0.9, 1.0)
          handled individual documents: one TCP connection, one request, one
          response. HTTP/1.1 added persistent connections and pipelining, and
          has powered the web for decades. As web pages became &quot;mini
          applications&quot; with many assets, the original design started to
          show performance limits. HTTP/2 and HTTP/3 are both attempts to keep
          the same developer-facing API while fixing those transport problems.
        </p>
      </section>

      {/* 2. Problems in HTTP/1.1 */}
      <section id="problems" className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          2. Performance problems in HTTP/1.1
        </h2>
        <p className="text-gray-300 max-w-3xl">
          Modern pages often need tens or hundreds of separate files. With
          HTTP/1.1, browsers usually open 6–8 TCP connections per origin to
          fetch these resources in parallel. Each connection has its own
          handshake and congestion window, which adds overhead.
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>
            <strong>Many TCP connections:</strong> extra handshakes, more state
            on servers, less efficient congestion control.
          </li>
          <li>
            <strong>Head-of-line blocking:</strong> pipelined requests must be
            delivered in order; a slow response can block later ones.
          </li>
          <li>
            <strong>No built-in header compression:</strong> large headers like
            cookies are repeated on every request.
          </li>
        </ul>
      </section>

      {/* 3. HTTP/2 */}
      <section id="http2" className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          3. HTTP/2: binary framing and multiplexing
        </h2>
        <p className="text-gray-300 max-w-3xl">
          HTTP/2 keeps the same idea of requests and responses, but changes the
          &quot;wire format&quot;. Instead of plain text, it uses a binary
          framing layer with <em>streams</em> and <em>frames</em>. All streams
          share a single TCP connection.
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>
            <strong>Single TCP connection:</strong> one congestion window to
            manage for the whole page.
          </li>
          <li>
            <strong>Streams:</strong> each request/response pair has a numeric
            stream ID.
          </li>
          <li>
            <strong>Frames:</strong> small chunks of header or body data that
            belong to a specific stream.
          </li>
          <li>
            <strong>Multiplexing:</strong> frames from different streams can be
            interleaved, so a slow stream does not completely stop others.
          </li>
          <li>
            <strong>HPACK header compression:</strong> header fields are stored
            in a dynamic table and efficiently encoded.
          </li>
        </ul>

        <div className="mt-4 border border-slate-800 rounded-lg p-4 bg-slate-950/40 text-sm text-gray-300">
          <p className="font-semibold mb-1">Diagram (conceptual):</p>
          <p>
            Imagine three vertical lanes (streams 1, 3, 5) all feeding small
            colored blocks into one horizontal pipe (the TCP connection). The
            blocks are frames. The browser and server know which stream each
            block belongs to and can reassemble the responses.
          </p>
        </div>
      </section>

      {/* 4. HTTP/3 */}
      <section id="http3" className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          4. HTTP/3: QUIC and streams over UDP
        </h2>
        <p className="text-gray-300 max-w-3xl">
          HTTP/3 uses the same high-level message format, but runs over QUIC
          instead of TCP. QUIC is a transport protocol built on UDP that
          incorporates TLS, multiplexed streams, and connection migration into
          one layer.
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>
            <strong>UDP-based:</strong> QUIC runs in user space and can evolve
            faster than TCP, which is typically in the OS kernel.
          </li>
          <li>
            <strong>Independent streams:</strong> packet loss on one stream only
            delays that stream; others can continue delivering data.
          </li>
          <li>
            <strong>Faster handshakes:</strong> 0-RTT and 1-RTT connection
            setup when resuming previous sessions.
          </li>
          <li>
            <strong>Connection migration:</strong> a QUIC connection can survive
            IP/port changes (for example, switching Wi-Fi to mobile).
          </li>
          <li>
            <strong>QPACK:</strong> header compression adapted to HTTP/3&apos;s
            different ordering guarantees.
          </li>
        </ul>

        <div className="mt-4 border border-slate-800 rounded-lg p-4 bg-slate-950/40 text-sm text-gray-300">
          <p className="font-semibold mb-1">Diagram (conceptual):</p>
          <p>
            Draw TCP as a single ordered stream of bytes. Then draw QUIC as
            multiple smaller ordered streams on top of UDP packets. If packets
            for stream A are lost, streams B and C can still advance.
          </p>
        </div>
      </section>

      {/* 5. Comparison table */}
      <section id="compare" className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          5. Side-by-side comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-slate-800">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-3 py-2 border-b border-slate-800 text-left">
                  Feature
                </th>
                <th className="px-3 py-2 border-b border-slate-800 text-left">
                  HTTP/1.1
                </th>
                <th className="px-3 py-2 border-b border-slate-800 text-left">
                  HTTP/2
                </th>
                <th className="px-3 py-2 border-b border-slate-800 text-left">
                  HTTP/3
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-950/40">
                <td className="px-3 py-2 border-b border-slate-800">
                  Transport
                </td>
                <td className="px-3 py-2 border-b border-slate-800">TCP</td>
                <td className="px-3 py-2 border-b border-slate-800">TCP</td>
                <td className="px-3 py-2 border-b border-slate-800">QUIC (UDP)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-slate-800">
                  Connections per origin
                </td>
                <td className="px-3 py-2 border-b border-slate-800">
                  Many (e.g., 6–8)
                </td>
                <td className="px-3 py-2 border-b border-slate-800">
                  Typically one
                </td>
                <td className="px-3 py-2 border-b border-slate-800">
                  One QUIC connection
                </td>
              </tr>
              <tr className="bg-slate-950/40">
                <td className="px-3 py-2 border-b border-slate-800">
                  Multiplexing
                </td>
                <td className="px-3 py-2 border-b border-slate-800">
                  Limited (per connection)
                </td>
                <td className="px-3 py-2 border-b border-slate-800">
                  Yes, via streams/frames
                </td>
                <td className="px-3 py-2 border-b border-slate-800">
                  Yes, at transport layer
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-slate-800">
                  Head-of-line blocking
                </td>
                <td className="px-3 py-2 border-b border-slate-800">
                  At TCP and HTTP level
                </td>
                <td className="px-3 py-2 border-b border-slate-800">
                  At TCP level (one lost packet can stall all streams)
                </td>
                <td className="px-3 py-2 border-b border-slate-800">
                  Avoided between streams (loss affects only that stream)
                </td>
              </tr>
              <tr className="bg-slate-950/40">
                <td className="px-3 py-2 border-b border-slate-800">
                  Header compression
                </td>
                <td className="px-3 py-2 border-b border-slate-800">
                  None (plain text)
                </td>
                <td className="px-3 py-2 border-b border-slate-800">HPACK</td>
                <td className="px-3 py-2 border-b border-slate-800">QPACK</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Next steps */}
      <section id="next" className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          6. Connecting to the Playground & Labs
        </h2>
        <p className="text-gray-300 max-w-3xl">
          The Playground will let you choose a mix of resources (CSS, JS,
          images) and load them over HTTP/1.1, HTTP/2, and HTTP/3. You will
          measure total load time and visualize how multiplexing and head-of-line
          blocking show up in the waterfall.
        </p>
        <p className="text-gray-300 max-w-3xl">
          The Labs will give you specific tasks, such as &quot;capture a
          screenshot of the HTTP/1.1 waterfall&quot; or &quot;explain why HTTP/3
          is less affected by packet loss in this scenario.&quot;
        </p>
      </section>

      {/* 7. References */}
      <section id="refs" className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          7. References & further reading
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
          <li>
            RFC 7230–7235: Hypertext Transfer Protocol (HTTP/1.1) message
            syntax and routing.
          </li>
          <li>RFC 7540: Hypertext Transfer Protocol Version 2 (HTTP/2).</li>
          <li>RFC 9114: HTTP/3.</li>
          <li>
            Ilya Grigorik,{" "}
            <em>High Performance Browser Networking</em> (O&apos;Reilly).
          </li>
          <li>
            Browser DevTools network panel documentation for your preferred
            browser (Chrome, Edge, Firefox).
          </li>
        </ul>
      </section>
    </div>
  );
}