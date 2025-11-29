package com.asu.http23lab.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ResourceController {

    private static final int DEFAULT_SIZE_KB = 2;   // default ~2 KB CSS
    private static final long CSS_DELAY_MS = 50L;   // ~50 ms artificial delay

    /**
     * 2.1 GET /api/resource/css
     *
     * Simulates loading a CSS file of a given size with a small delay.
     */
    @GetMapping(value = "/api/resource/css", produces = "text/css")
    public String getCss(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam(name = "size", required = false) Integer sizeKb
    ) throws InterruptedException {

        // simulate latency
        Thread.sleep(CSS_DELAY_MS);

        int kb = (sizeKb == null || sizeKb <= 0) ? DEFAULT_SIZE_KB : sizeKb;
        int targetChars = kb * 1024;  // approximate, chars ≈ bytes here

        String header = "/* fake css file"
                + (id != null ? " id=" + id : "")
                + " size≈" + kb + "KB */\n";

        String snippet = "body { background: #f5f5f5; }\n"
                + ".item { margin: 4px; padding: 4px; }\n";

        StringBuilder css = new StringBuilder(header);
        while (css.length() < targetChars) {
            css.append(snippet);
        }

        return css.toString();
    }

    private static final int DEFAULT_JS_SIZE_KB = 4;   // default ~4 KB
    private static final long JS_DELAY_MS = 80L; 

     @GetMapping(value = "/api/resource/js", produces = "application/javascript")
    public String getJs(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam(name = "size", required = false) Integer sizeKb
    ) throws InterruptedException {

        // simulate latency
        Thread.sleep(JS_DELAY_MS);

        int kb = (sizeKb == null || sizeKb <= 0) ? DEFAULT_JS_SIZE_KB : sizeKb;
        int targetChars = kb * 1024;  // approx size in bytes

        String header = "// fake js file"
                + (id != null ? " id=" + id : "")
                + " size≈" + kb + "KB\n";

        String snippet = "function foo(){ return 42; }\n" +
                         "const x = foo();\n";

        StringBuilder js = new StringBuilder(header);
        while (js.length() < targetChars) {
            js.append(snippet);
        }

        return js.toString();
    }

    private static final int DEFAULT_IMAGE_SIZE_KB = 16;   // default ~16 KB
    private static final long IMAGE_DELAY_MS = 120L;       // ~120 ms delay

    /**
     * 2.3 GET /api/resource/image
     *
     * Simulates loading an image by returning a dummy byte array.
     */
    @GetMapping(value = "/api/resource/image", produces = "application/octet-stream")
    public byte[] getImage(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam(name = "size", required = false) Integer sizeKb
    ) throws InterruptedException {

        // simulate latency
        Thread.sleep(IMAGE_DELAY_MS);

        int kb = (sizeKb == null || sizeKb <= 0) ? DEFAULT_IMAGE_SIZE_KB : sizeKb;
        int numBytes = kb * 1024;

        byte[] bytes = new byte[numBytes];

        // Fill with some pattern so it's not all zeros
        for (int i = 0; i < numBytes; i++) {
            bytes[i] = (byte) (i % 256);
        }

        return bytes;
    }

        private static final long FAST_API_DELAY_MS = 30L;   // ~30 ms delay

    /**
     * 2.4 GET /api/resource/api/fast
     *
     * Fast API endpoint used for latency comparison.
     */
    @GetMapping("/api/resource/api/fast")
    public Map<String, Object> getFastApi(
            @RequestParam(name = "id", required = false) Integer id
    ) throws InterruptedException {

        // simulate latency
        Thread.sleep(FAST_API_DELAY_MS);

        Map<String, Object> body = new HashMap<>();
        body.put("type", "fast");
        body.put("id", id);
        body.put("timestamp", Instant.now().toString());

        return body;
    }

        private static final long SLOW_API_DELAY_MS = 2000L;   // ~2 seconds

    /**
     * 2.5 GET /api/resource/api/slow
     *
     * Slow API endpoint to simulate a heavy operation.
     */
    @GetMapping("/api/resource/api/slow")
    public Map<String, Object> getSlowApi(
            @RequestParam(name = "id", required = false) Integer id
    ) throws InterruptedException {

        // simulate long latency
        Thread.sleep(SLOW_API_DELAY_MS);

        Map<String, Object> body = new HashMap<>();
        body.put("type", "slow");
        body.put("id", id);
        body.put("timestamp", Instant.now().toString());

        return body;
    }

}
