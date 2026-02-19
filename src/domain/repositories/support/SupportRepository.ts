export interface Ticket {
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  createdTime: string;
  userId: number;
  tags: string[];
  ai_comments: string;
  administratorResponse?: string;
  administrator?: {
    id: number;
    fullName: string;
  };
}

export interface User {
  id: number;
  fullName: string;
  telegramId?: string;
}

export interface TicketResponse {
  ticket: Ticket;
  user: User;
}

export interface TicketType {
  code: string;
  title: string;
}

export interface SupportAnalyticsResponse {
  responsibleTypes: string[];
  totalTickets: number;
  ticketsMonth: number;
  problemTickets: number;
  avgResponseTime: number;
  satisfactionScore: number;
}

export interface SupportRepository {
  getAnalytics(): Promise<SupportAnalyticsResponse>;
  getTickets(status?: string, type?: string, search?: string): Promise<{ items: TicketResponse[], total: number }>;
  getTicketTypes(): Promise<TicketType[]>;
  getAiSuggestions(ticketId: number): Promise<string[]>;
  addResponse(ticketId: number, data: { response: string; status?: string }): Promise<string>;
  updateStatus(ticketId: number, data: { status: string }): Promise<string>;
  getAiSummary(ticketId: number): Promise<string>;
}
