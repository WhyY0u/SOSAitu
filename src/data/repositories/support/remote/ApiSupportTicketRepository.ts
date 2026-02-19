import apiClient from '@/data/datasources/api/apiClient';
import type { Ticket } from '@/domain/repositories/support/SupportRepository';

export interface UpdateSupportTicketRequest {
  ticketId: number;
  status?: string;
  comment?: string;
}

export default class ApiSupportTicketRepository {
  async updateTicket(request: UpdateSupportTicketRequest): Promise<Ticket> {
    const response = await apiClient.post<Ticket>(`/support/tickets/${request.ticketId}/reply`, {
      status: request.status,
      comment: request.comment
    });
    return response.data;
  }
}
