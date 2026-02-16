import apiClient from "@/data/datasources/api/apiClient";

export interface TicketFeedbackPayload {
  score: number;
  comment?: string;
}

export class ApiTicketFeedbackRepository {
  async sendFeedback(ticketId: number, payload: TicketFeedbackPayload): Promise<void> {
    await apiClient.put(`/user/ticket/${ticketId}/feedback`, payload);
  }
}

