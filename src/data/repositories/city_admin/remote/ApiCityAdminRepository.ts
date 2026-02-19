import apiClient from "@/data/datasources/api/apiClient";
import type { CityAdminAnalyticsResponse, CityAdminRepository } from "@/domain/repositories/city_admin/CityAdminRepository";

export default class CityAdminApiRepository implements CityAdminRepository {
  async getAnalytics(): Promise<CityAdminAnalyticsResponse> {
    return (await apiClient.get('/city-admin/analytics')).data;
  }

  async getAiInsights(): Promise<string> {
    return (await apiClient.get('/city-admin/ai-insights')).data;
  }

  async getSupervisors(): Promise<any[]> {
    return (await apiClient.get('/city-admin/supervisors')).data;
  }

  async getTicketTypes(): Promise<{code: string, title: string}[]> {
    return (await apiClient.get('/user/ticket-types')).data;
  }

  async addSupervisor(userId: number, types: string[]): Promise<string> {
    return (await apiClient.post('/city-admin/add-supervisor', { userId, types })).data;
  }

  async deleteSupervisor(userId: number): Promise<void> {
    await apiClient.delete(`/city-admin/supervisor/${userId}`);
  }

  async getMonthlyReport(): Promise<string> {
    return (await apiClient.get('/city-admin/monthly-report')).data;
  }
}
