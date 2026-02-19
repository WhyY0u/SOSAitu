import type { TicketCategoryStat } from './UserRepository';

export interface CityAdminAnalyticsResponse {
  cityName: string;
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

export interface CityAdminRepository {
  getAnalytics(): Promise<CityAdminAnalyticsResponse>;
  getAiInsights(): Promise<string>;
  getSupervisors(): Promise<any[]>;
  addSupervisor(userId: number, types: string[]): Promise<string>;
  deleteSupervisor(userId: number): Promise<void>;
  getMonthlyReport(): Promise<string>;
}
