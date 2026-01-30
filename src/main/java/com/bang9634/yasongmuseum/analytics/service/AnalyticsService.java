package com.bang9634.yasongmuseum.analytics.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.bang9634.yasongmuseum.analytics.dto.AnalyticsResponse;
import com.google.analytics.data.v1beta.BetaAnalyticsDataClient;
import com.google.analytics.data.v1beta.BetaAnalyticsDataSettings;
import com.google.analytics.data.v1beta.DateRange;
import com.google.analytics.data.v1beta.Dimension;
import com.google.analytics.data.v1beta.Metric;
import com.google.analytics.data.v1beta.RunReportRequest;
import com.google.analytics.data.v1beta.RunReportResponse;
import com.google.analytics.data.v1beta.Row;
import com.google.auth.oauth2.GoogleCredentials;

import lombok.extern.slf4j.Slf4j;

/**
 * Service for retrieving Google Analytics data
 */
@Slf4j
@Service
public class AnalyticsService {
    
    @Value("${google.analytics.property-id}")
    private String propertyId;
    
    @Value("${google.analytics.credentials-path:#{null}}")
    private String credentialsPath;
    
    /**
     * Get analytics data for the last N days
     * 
     * @param days Number of days to retrieve data for (default: 30)
     * @return Analytics response with comprehensive metrics
     */
    public AnalyticsResponse getAnalyticsData(int days) {
        try (BetaAnalyticsDataClient analyticsData = createAnalyticsClient()) {
            
            String startDate = days + "daysAgo";
            String endDate = "today";
            
            // Get overview metrics
            AnalyticsResponse.OverviewMetrics overview = getOverviewMetrics(analyticsData, startDate, endDate);
            
            // Get top pages
            List<AnalyticsResponse.PageMetric> topPages = getTopPages(analyticsData, startDate, endDate);
            
            // Get traffic sources
            List<AnalyticsResponse.TrafficSource> trafficSources = getTrafficSources(analyticsData, startDate, endDate);
            
            // Get device breakdown
            List<AnalyticsResponse.DeviceMetric> deviceBreakdown = getDeviceBreakdown(analyticsData, startDate, endDate);
            
            // Get daily metrics
            List<AnalyticsResponse.DailyMetric> dailyMetrics = getDailyMetrics(analyticsData, startDate, endDate);
            
            // Get location breakdown (시/군/구 별 사용자 정보)
            List<AnalyticsResponse.LocationMetric> locationBreakdown = getLocationBreakdown(analyticsData, startDate, endDate);
            
            return AnalyticsResponse.builder()
                .overview(overview)
                .topPages(topPages)
                .trafficSources(trafficSources)
                .deviceBreakdown(deviceBreakdown)
                .dailyMetrics(dailyMetrics)
                .locationBreakdown(locationBreakdown)
                .build();
                
        } catch (Exception e) {
            log.error("Failed to retrieve analytics data", e);
            throw new RuntimeException("분석 데이터를 가져오는데 실패했습니다: " + e.getMessage(), e);
        }
    }
    
    /**
     * Create BetaAnalyticsDataClient with credentials
     */
    private BetaAnalyticsDataClient createAnalyticsClient() throws IOException {
        if (credentialsPath != null && !credentialsPath.isEmpty()) {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                new FileInputStream(credentialsPath)
            );
            
            BetaAnalyticsDataSettings settings = BetaAnalyticsDataSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();
                
            return BetaAnalyticsDataClient.create(settings);
        } else {
            // Use Application Default Credentials
            return BetaAnalyticsDataClient.create();
        }
    }
    
    /**
     * Get overview metrics (total users, sessions, pageviews, etc.)
     */
    private AnalyticsResponse.OverviewMetrics getOverviewMetrics(
            BetaAnalyticsDataClient analyticsData, String startDate, String endDate) {
        
        RunReportRequest request = RunReportRequest.newBuilder()
            .setProperty("properties/" + propertyId)
            .addDateRanges(DateRange.newBuilder().setStartDate(startDate).setEndDate(endDate))
            .addMetrics(Metric.newBuilder().setName("totalUsers"))
            .addMetrics(Metric.newBuilder().setName("newUsers"))
            .addMetrics(Metric.newBuilder().setName("sessions"))
            .addMetrics(Metric.newBuilder().setName("screenPageViews"))
            .addMetrics(Metric.newBuilder().setName("averageSessionDuration"))
            .addMetrics(Metric.newBuilder().setName("bounceRate"))
            .addMetrics(Metric.newBuilder().setName("engagementRate"))
            .build();
        
        RunReportResponse response = analyticsData.runReport(request);
        
        if (response.getRowsCount() > 0) {
            Row row = response.getRows(0);
            return AnalyticsResponse.OverviewMetrics.builder()
                .totalUsers(Long.parseLong(row.getMetricValues(0).getValue()))
                .newUsers(Long.parseLong(row.getMetricValues(1).getValue()))
                .sessions(Long.parseLong(row.getMetricValues(2).getValue()))
                .pageViews(Long.parseLong(row.getMetricValues(3).getValue()))
                .averageSessionDuration(Double.parseDouble(row.getMetricValues(4).getValue()))
                .bounceRate(Double.parseDouble(row.getMetricValues(5).getValue()) * 100)
                .engagementRate(Double.parseDouble(row.getMetricValues(6).getValue()) * 100)
                .build();
        }
        
        return AnalyticsResponse.OverviewMetrics.builder().build();
    }
    
    /**
     * Get top pages by views
     */
    private List<AnalyticsResponse.PageMetric> getTopPages(
            BetaAnalyticsDataClient analyticsData, String startDate, String endDate) {
        
        RunReportRequest request = RunReportRequest.newBuilder()
            .setProperty("properties/" + propertyId)
            .addDateRanges(DateRange.newBuilder().setStartDate(startDate).setEndDate(endDate))
            .addDimensions(Dimension.newBuilder().setName("pagePath"))
            .addDimensions(Dimension.newBuilder().setName("pageTitle"))
            .addMetrics(Metric.newBuilder().setName("screenPageViews"))
            .addMetrics(Metric.newBuilder().setName("totalUsers"))
            .addMetrics(Metric.newBuilder().setName("averageSessionDuration"))
            .setLimit(10) // Top 10 pages
            .build();
        
        RunReportResponse response = analyticsData.runReport(request);
        List<AnalyticsResponse.PageMetric> pages = new ArrayList<>();
        
        for (Row row : response.getRowsList()) {
            pages.add(AnalyticsResponse.PageMetric.builder()
                .pagePath(row.getDimensionValues(0).getValue())
                .pageTitle(row.getDimensionValues(1).getValue())
                .views(Long.parseLong(row.getMetricValues(0).getValue()))
                .uniquePageViews(Long.parseLong(row.getMetricValues(1).getValue()))
                .averageTimeOnPage(Double.parseDouble(row.getMetricValues(2).getValue()))
                .build());
        }
        
        return pages;
    }
    
    /**
     * Get traffic sources
     */
    private List<AnalyticsResponse.TrafficSource> getTrafficSources(
            BetaAnalyticsDataClient analyticsData, String startDate, String endDate) {
        
        RunReportRequest request = RunReportRequest.newBuilder()
            .setProperty("properties/" + propertyId)
            .addDateRanges(DateRange.newBuilder().setStartDate(startDate).setEndDate(endDate))
            .addDimensions(Dimension.newBuilder().setName("sessionSource"))
            .addDimensions(Dimension.newBuilder().setName("sessionMedium"))
            .addMetrics(Metric.newBuilder().setName("totalUsers"))
            .addMetrics(Metric.newBuilder().setName("sessions"))
            .build();
        
        RunReportResponse response = analyticsData.runReport(request);
        List<AnalyticsResponse.TrafficSource> sources = new ArrayList<>();
        
        long totalUsers = response.getRowsList().stream()
            .mapToLong(row -> Long.parseLong(row.getMetricValues(0).getValue()))
            .sum();
        
        for (Row row : response.getRowsList()) {
            long users = Long.parseLong(row.getMetricValues(0).getValue());
            sources.add(AnalyticsResponse.TrafficSource.builder()
                .source(row.getDimensionValues(0).getValue())
                .medium(row.getDimensionValues(1).getValue())
                .users(users)
                .sessions(Long.parseLong(row.getMetricValues(1).getValue()))
                .percentage(totalUsers > 0 ? (users * 100.0 / totalUsers) : 0)
                .build());
        }
        
        return sources;
    }
    
    /**
     * Get device breakdown
     */
    private List<AnalyticsResponse.DeviceMetric> getDeviceBreakdown(
            BetaAnalyticsDataClient analyticsData, String startDate, String endDate) {
        
        RunReportRequest request = RunReportRequest.newBuilder()
            .setProperty("properties/" + propertyId)
            .addDateRanges(DateRange.newBuilder().setStartDate(startDate).setEndDate(endDate))
            .addDimensions(Dimension.newBuilder().setName("deviceCategory"))
            .addMetrics(Metric.newBuilder().setName("totalUsers"))
            .addMetrics(Metric.newBuilder().setName("sessions"))
            .build();
        
        RunReportResponse response = analyticsData.runReport(request);
        List<AnalyticsResponse.DeviceMetric> devices = new ArrayList<>();
        
        long totalUsers = response.getRowsList().stream()
            .mapToLong(row -> Long.parseLong(row.getMetricValues(0).getValue()))
            .sum();
        
        for (Row row : response.getRowsList()) {
            long users = Long.parseLong(row.getMetricValues(0).getValue());
            devices.add(AnalyticsResponse.DeviceMetric.builder()
                .deviceCategory(row.getDimensionValues(0).getValue())
                .users(users)
                .sessions(Long.parseLong(row.getMetricValues(1).getValue()))
                .percentage(totalUsers > 0 ? (users * 100.0 / totalUsers) : 0)
                .build());
        }
        
        return devices;
    }
    
    /**
     * Get daily metrics for chart visualization
     */
    private List<AnalyticsResponse.DailyMetric> getDailyMetrics(
            BetaAnalyticsDataClient analyticsData, String startDate, String endDate) {
        
        RunReportRequest request = RunReportRequest.newBuilder()
            .setProperty("properties/" + propertyId)
            .addDateRanges(DateRange.newBuilder().setStartDate(startDate).setEndDate(endDate))
            .addDimensions(Dimension.newBuilder().setName("date"))
            .addMetrics(Metric.newBuilder().setName("totalUsers"))
            .addMetrics(Metric.newBuilder().setName("sessions"))
            .addMetrics(Metric.newBuilder().setName("screenPageViews"))
            .build();
        
        RunReportResponse response = analyticsData.runReport(request);
        List<AnalyticsResponse.DailyMetric> dailyMetrics = new ArrayList<>();
        
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        for (Row row : response.getRowsList()) {
            String dateStr = row.getDimensionValues(0).getValue();
            LocalDate date = LocalDate.parse(dateStr, inputFormatter);
            
            dailyMetrics.add(AnalyticsResponse.DailyMetric.builder()
                .date(date.format(outputFormatter))
                .users(Long.parseLong(row.getMetricValues(0).getValue()))
                .sessions(Long.parseLong(row.getMetricValues(1).getValue()))
                .pageViews(Long.parseLong(row.getMetricValues(2).getValue()))
                .build());
        }
        
        return dailyMetrics;
    }
    
    /**
     * Get location breakdown (city level - 시/군/구 별 사용자 정보)
     */
    private List<AnalyticsResponse.LocationMetric> getLocationBreakdown(
            BetaAnalyticsDataClient analyticsData, String startDate, String endDate) {
        
        RunReportRequest request = RunReportRequest.newBuilder()
            .setProperty("properties/" + propertyId)
            .addDateRanges(DateRange.newBuilder().setStartDate(startDate).setEndDate(endDate))
            .addDimensions(Dimension.newBuilder().setName("country"))
            .addDimensions(Dimension.newBuilder().setName("region"))
            .addDimensions(Dimension.newBuilder().setName("city"))
            .addMetrics(Metric.newBuilder().setName("totalUsers"))
            .addMetrics(Metric.newBuilder().setName("sessions"))
            .addMetrics(Metric.newBuilder().setName("screenPageViews"))
            .setLimit(50) // Top 50 locations
            .build();
        
        RunReportResponse response = analyticsData.runReport(request);
        List<AnalyticsResponse.LocationMetric> locations = new ArrayList<>();
        
        long totalUsers = response.getRowsList().stream()
            .mapToLong(row -> Long.parseLong(row.getMetricValues(0).getValue()))
            .sum();
        
        for (Row row : response.getRowsList()) {
            long users = Long.parseLong(row.getMetricValues(0).getValue());
            locations.add(AnalyticsResponse.LocationMetric.builder()
                .country(row.getDimensionValues(0).getValue())
                .region(row.getDimensionValues(1).getValue())
                .city(row.getDimensionValues(2).getValue())
                .users(users)
                .sessions(Long.parseLong(row.getMetricValues(1).getValue()))
                .pageViews(Long.parseLong(row.getMetricValues(2).getValue()))
                .percentage(totalUsers > 0 ? (users * 100.0 / totalUsers) : 0)
                .build());
        }
        
        return locations;
    }
}
