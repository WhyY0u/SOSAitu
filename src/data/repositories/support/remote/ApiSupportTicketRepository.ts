import apiClient from '@/data/datasources/api/apiClient';
import type { Ticket } from '@/domain/repositories/support/SupportRepository';

export interface UpdateSupportTicketRequest {
  ticketId: number;
  status?: string;
  comment?: string;
}

export default class ApiSupportTicketRepository {
  async updateTicket(request: UpdateSupportTicketRequest): Promise<void> {
    await apiClient.post(`/support/ticket/${request.ticketId}/response`, {
      response: request.comment,
      status: request.status
    });
  }
}
