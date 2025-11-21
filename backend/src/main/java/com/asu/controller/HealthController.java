package com.asu.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("/api/protocol")
    public Map<String, String> protocol(HttpServletRequest request) {
        // Example values: "HTTP/1.1", "HTTP/2.0"
        String protocol = request.getProtocol();
        return Map.of("protocol", protocol);
    }
}
