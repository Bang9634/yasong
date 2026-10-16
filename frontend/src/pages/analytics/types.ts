export interface OverviewMetrics {
  totalUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  engagementRate: number;
}

export interface PageMetric {
  pagePath: string;
  pageTitle: string;
  views: number;
  uniquePageViews: number;
  averageTimeOnPage: number;
}

export interface TrafficSource {
  source: string;
  medium: string;
  users: number;
  sessions: number;
  percentage: number;
}

export interface DeviceMetric {
  deviceCategory: string;
  users: number;
  sessions: number;
  percentage: number;
}

export interface DailyMetric {
  date: string;
  users: number;
  sessions: number;
  pageViews: number;
}

export interface LocationMetric {
  country: string;
  region: string;
  city: string;
  users: number;
  sessions: number;
  pageViews: number;
  percentage: number;
}

export interface AnalyticsData {
  overview: OverviewMetrics;
  topPages: PageMetric[];
  trafficSources: TrafficSource[];
  deviceBreakdown: DeviceMetric[];
  dailyMetrics: DailyMetric[];
  locationBreakdown: LocationMetric[];
}
