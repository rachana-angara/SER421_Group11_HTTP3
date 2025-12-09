package com.asu.http23lab.controller;


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
        String protocol = request.getProtocol();
        return Map.of("protocol", protocol);
    }
}
