import apiClient from "@/data/datasources/api/apiClient";
import type { SupportAnalyticsResponse, SupportRepository, TicketResponse, TicketType } from "@/domain/repositories/support/SupportRepository";

export default class SupportApiRepository implements SupportRepository {
  async getAnalytics(): Promise<SupportAnalyticsResponse> {
    return (await apiClient.get('/support/analytics')).data;
  }

  async getTickets(status?: string, type?: string, search?: string): Promise<{ items: TicketResponse[], total: number }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    if (search) params.append('search', search);

    return (await apiClient.get(`/support/tickets?${params.toString()}`)).data;
  }

  async getTicketTypes(): Promise<TicketType[]> {
    return (await apiClient.get('/support/ticket-types')).data;
  }

  async getAiSuggestions(ticketId: number): Promise<string[]> {
    return (await apiClient.post(`/support/ticket/${ticketId}/ai-suggestions`)).data;
  }

  async addResponse(ticketId: number, data: { response: string; status?: string }): Promise<string> {
    return (await apiClient.post(`/support/ticket/${ticketId}/response`, data)).data;
  }

  async updateStatus(ticketId: number, data: { status: string }): Promise<string> {
    return (await apiClient.put(`/support/ticket/${ticketId}/status`, data)).data;
  }

  async getAiSummary(ticketId: number): Promise<string> {
    return (await apiClient.get(`/support/ticket/${ticketId}/ai-summary`)).data;
  }
}
