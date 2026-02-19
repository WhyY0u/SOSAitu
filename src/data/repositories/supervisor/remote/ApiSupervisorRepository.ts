import apiClient from "@/data/datasources/api/apiClient";
import type { SupervisorAnalytics, SupervisorRepository, TicketType } from "@/domain/repositories/supervisor/SupervisorRepository";

export default class SupervisorApiRepository implements SupervisorRepository {
  async getAnalytics(): Promise<SupervisorAnalytics> {
    return (await apiClient.get('/supervisor/analytics')).data;
  }

  async getAiInsights(): Promise<string> {
    return (await apiClient.get('/supervisor/ai-insights')).data;
  }

  async addSupport(userId: number, types: string[]): Promise<string> {
    return (await apiClient.post('/supervisor/add-support', { userId, types })).data;
  }

  async deleteSupport(userId: number): Promise<void> {
    await apiClient.delete(`/supervisor/support/${userId}`);
  }

  async getTicketTypes(): Promise<TicketType[]> {
    return (await apiClient.get('/supervisor/ticket-types')).data;
  }
}
