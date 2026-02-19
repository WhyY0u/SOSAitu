import type { TicketCategoryStat } from './UserRepository';

export interface RegionAdminAnalyticsResponse {
  regionName: string;
  totalTickets: number;
  ticketsMonth: number;
  problemTickets: number;
  avgResponseTime: number;
  satisfactionScore: number;
  categoryStats: TicketCategoryStat[];
  adminPerformance: AdminPerformanceDto[];
  aiReport: string;
}

export interface AdminPerformanceDto {
  fullname: string;
  category: string;
  decided: number;
  inWork: number;
  averageTime: number;
  status: string;
}

export interface CityAdministrator {
  id: number;
  fullName: string;
  telegramId: string;
  city: string | null;
  cityId: number | null;
  responsible: string[];
  status: string;
}

export interface City {
  id: number;
  name: string;
}

export interface CityStatistics {
  cityId: number;
  cityName: string;
  totalTickets: number;
  ticketsMonth: number;
  problemTickets: number;
  avgResponseTime: number;
  satisfactionScore: number;
  categoryStats: TicketCategoryStat[];
}

export interface RegionAdminRepository {
  getAnalytics(): Promise<RegionAdminAnalyticsResponse>;
  getMonthlyReport(): Promise<string>;
  getInsights(): Promise<string>;
  getCitiesStatistics(): Promise<CityStatistics[]>;
  getCityStatistics(cityId: number): Promise<CityStatistics>;
  getCityAdministrators(): Promise<CityAdministrator[]>;
  getCities(): Promise<City[]>;
  addCityAdministrator(userId: number, cityId: number): Promise<void>;
  deleteCityAdministrator(userId: number): Promise<void>;
}
