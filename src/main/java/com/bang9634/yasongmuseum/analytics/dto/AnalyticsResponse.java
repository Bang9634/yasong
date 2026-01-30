package com.bang9634.yasongmuseum.analytics.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for Google Analytics data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    
    /**
     * Overview metrics for the specified period
     */
    private OverviewMetrics overview;
    
    /**
     * Top pages by views
     */
    private List<PageMetric> topPages;
    
    /**
     * Traffic sources breakdown
     */
    private List<TrafficSource> trafficSources;
    
    /**
     * Device category breakdown
     */
    private List<DeviceMetric> deviceBreakdown;
    
    /**
     * Daily metrics for the period
     */
    private List<DailyMetric> dailyMetrics;
    
    /**
     * Location (city) breakdown - 시/군/구 별 사용자 정보
     */
    private List<LocationMetric> locationBreakdown;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverviewMetrics {
        private Long totalUsers;
        private Long newUsers;
        private Long sessions;
        private Long pageViews;
        private Double averageSessionDuration; // in seconds
        private Double bounceRate; // percentage
        private Double engagementRate; // percentage
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageMetric {
        private String pagePath;
        private String pageTitle;
        private Long views;
        private Long uniquePageViews;
        private Double averageTimeOnPage; // in seconds
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrafficSource {
        private String source;
        private String medium;
        private Long users;
        private Long sessions;
        private Double percentage;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceMetric {
        private String deviceCategory; // desktop, mobile, tablet
        private Long users;
        private Long sessions;
        private Double percentage;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyMetric {
        private String date; // YYYY-MM-DD format
        private Long users;
        private Long sessions;
        private Long pageViews;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationMetric {
        private String country; // 국가
        private String region; // 지역/도
        private String city; // 시/군/구
        private Long users;
        private Long sessions;
        private Long pageViews;
        private Double percentage;
    }
}
