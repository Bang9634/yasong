package com.bang9634.yasongmuseum.analytics.controller;

import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.analytics.dto.AnalyticsResponse;
import com.bang9634.yasongmuseum.analytics.service.AnalyticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Analytics Controller
 * Admin-only endpoint to retrieve Google Analytics data
 * 
 * @apiNote This endpoint is restricted to ADMIN role only via SecurityConfig
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    
    @Lazy
    private final AnalyticsService analyticsService;
    
    /**
     * Get analytics data for the last N days
     * GET /api/admin/analytics?days=30
     * 
     * @param days Number of days to retrieve data for (default: 30, max: 365)
     * @return Comprehensive analytics data including:
     *         - Overview metrics (users, sessions, pageviews, bounce rate, etc.)
     *         - Top pages
     *         - Traffic sources
     *         - Device breakdown
     *         - Daily metrics for visualization
     */
    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @RequestParam(defaultValue = "30") int days) {
        
        log.info("Fetching analytics data for the last {} days", days);
        
        // Validate input
        if (days < 1) {
            days = 30;
        } else if (days > 365) {
            days = 365;
        }
        
        AnalyticsResponse analytics = analyticsService.getAnalyticsData(days);
        return ResponseEntity.ok(analytics);
    }
    
    /**
     * Get analytics summary for dashboard
     * GET /api/admin/analytics/summary
     * 
     * @return Quick summary for the last 7 days
     */
    @GetMapping("/summary")
    public ResponseEntity<AnalyticsResponse.OverviewMetrics> getSummary() {
        log.info("Fetching analytics summary");
        
        AnalyticsResponse analytics = analyticsService.getAnalyticsData(7);
        return ResponseEntity.ok(analytics.getOverview());
    }
}
