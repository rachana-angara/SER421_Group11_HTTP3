package com.asu.http23lab.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@RestController
public class ResourceController {


    private static final int DEFAULT_CSS_SIZE_KB = 2;    
    private static final long CSS_DELAY_MS = 50L;        

    /**
     * GET /api/resource/css
     *
     * Simulates loading a CSS file by sleeping for a small delay and returning
     * synthetic CSS content of approximately sizeKb kilobytes.
     */
    @GetMapping(value = "/api/resource/css", produces = "text/css")
    public String getCss(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam(name = "size", required = false) Integer sizeKb
    ) throws InterruptedException {

        Thread.sleep(CSS_DELAY_MS);

        int kb = (sizeKb == null || sizeKb <= 0) ? DEFAULT_CSS_SIZE_KB : sizeKb;
        int targetChars = kb * 1024; 

        String header = "/* fake css file"
                + (id != null ? " id=" + id : "")
                + " size≈" + kb + "KB */\n";

        String snippet =
                "body { background: #0f172a; color: #e5e7eb; }\n" +
                        ".item { margin: 4px; padding: 4px; }\n";

        StringBuilder css = new StringBuilder(header);
        while (css.length() < targetChars) {
            css.append(snippet);
        }

        return css.toString();
    }

    private static final int DEFAULT_JS_SIZE_KB = 4;     
    private static final long JS_DELAY_MS = 80L;        

    /**
     * GET /api/resource/js
     *
     * Simulates loading a JS file by sleeping and returning synthetic JS.
     */
    @GetMapping(value = "/api/resource/js", produces = "application/javascript")
    public String getJs(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam(name = "size", required = false) Integer sizeKb
    ) throws InterruptedException {

        Thread.sleep(JS_DELAY_MS);

        int kb = (sizeKb == null || sizeKb <= 0) ? DEFAULT_JS_SIZE_KB : sizeKb;
        int targetChars = kb * 1024;

        String header = "// fake js file"
                + (id != null ? " id=" + id : "")
                + " size≈" + kb + "KB\n";

        String snippet =
                "function foo() { return 42; }\n" +
                        "const x = foo(); console.log('x=', x);\n";

        StringBuilder js = new StringBuilder(header);
        while (js.length() < targetChars) {
            js.append(snippet);
        }

        return js.toString();
    }


    private static final int DEFAULT_IMAGE_SIZE_KB = 16; 
    private static final long IMAGE_DELAY_MS = 120L;    

    /**
     * GET /api/resource/image
     *
     * Simulates loading an image by returning a dummy byte array with
     * a simple pattern.
     */
    @GetMapping(value = "/api/resource/image", produces = "application/octet-stream")
    public byte[] getImage(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam(name = "size", required = false) Integer sizeKb
    ) throws InterruptedException {

        Thread.sleep(IMAGE_DELAY_MS);

        int kb = (sizeKb == null || sizeKb <= 0) ? DEFAULT_IMAGE_SIZE_KB : sizeKb;
        int numBytes = kb * 1024;

        byte[] bytes = new byte[numBytes];
        for (int i = 0; i < numBytes; i++) {
            bytes[i] = (byte) (i % 256);
        }

        return bytes;
    }


    /**
     * GET /api/resource/api/fast
     *
     * Fast API endpoint used for latency comparison.
     * It accepts protocol & condition (from the frontend) and simulates
     * a latency based on these parameters plus some jitter.
     *
     * Example:
     *   /api/resource/api/fast?protocol=http2&condition=wifi&id=1
     */
    @GetMapping("/api/resource/api/fast")
    public Map<String, Object> getFastApi(
            @RequestParam(name = "protocol", required = false, defaultValue = "http2") String protocol,
            @RequestParam(name = "condition", required = false, defaultValue = "wifi") String condition,
            @RequestParam(name = "id", required = false) Integer id
    ) throws InterruptedException {

        String proto = protocol.toLowerCase();
        String cond = condition.toLowerCase();

        long baseDelayMs;
        if ("http3".equals(proto)) {
            baseDelayMs = 25L;  
        } else {
            baseDelayMs = 60L; 
        }

        double scale;
        switch (cond) {
            case "5g":
                scale = 0.7;
                break;
            case "slow3g":
                scale = 3.0;
                break;
            case "wifi":
            default:
                scale = 1.0;
                break;
        }

        long configuredDelayMs = Math.round(baseDelayMs * scale);

        long jitterMs = ThreadLocalRandom.current().nextLong(0, 20);
        long simulatedLatencyMs = configuredDelayMs + jitterMs;

        Thread.sleep(simulatedLatencyMs);

        Map<String, Object> body = new HashMap<>();
        body.put("type", "fast");
        body.put("protocol", proto);
        body.put("condition", cond);
        body.put("configuredDelayMs", configuredDelayMs);
        body.put("measuredLatencyMs", simulatedLatencyMs);
        body.put("id", id);
        body.put("timestamp", Instant.now().toString());

        return body;
    }


    private static final long SLOW_API_DELAY_MS = 2000L;  

    /**
     * GET /api/resource/api/slow
     *
     * Slow API endpoint to simulate a heavy operation.
     */
    @GetMapping("/api/resource/api/slow")
    public Map<String, Object> getSlowApi(
            @RequestParam(name = "id", required = false) Integer id
    ) throws InterruptedException {

        Thread.sleep(SLOW_API_DELAY_MS);

        Map<String, Object> body = new HashMap<>();
        body.put("type", "slow");
        body.put("id", id);
        body.put("timestamp", Instant.now().toString());

        return body;
    }
}
