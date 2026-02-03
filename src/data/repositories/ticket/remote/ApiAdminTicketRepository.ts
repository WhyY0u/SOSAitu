import apiClient from '@/data/datasources/api/apiClient';
import type { AdminTicketRepository, TicketQueryAdmin, TicketResponse, UpdateTicketRequest } from '@/domain/repositories/ticket/AdminTicketRepository';


export default class ApiAdminTicketRepository implements AdminTicketRepository {

  async getTickets(query?: TicketQueryAdmin): Promise<{ items: TicketResponse[] }> {
    const res = await apiClient.get<TicketResponse[]>('/administator/tickets', {
      params: {
        status: query?.status,
        sortedStatus: query?.sortBy
      }
    });

    return {
      items: res.data // теперь items — это массив TicketResponse
    };
  }

  async updateTicket(request: UpdateTicketRequest): Promise<void> {
    await apiClient.post('/administator/ticket', request);
  }

}
