export interface SupportPerformance {
  id: number;
  fullName: string;
  category: string;
  decided: number;
  inWork: number;
  status: string;
}

export interface SupervisorAnalytics {
  totalTickets: number;
  ticketsMonth: number;
  problemTickets: number;
  avgResponseTime: number;
  satisfactionScore: number;
  supportPerformance: SupportPerformance[];
}

export interface TicketType {
  code: string;
  title: string;
}

export interface SupervisorRepository {
  getAnalytics(): Promise<SupervisorAnalytics>;
  getAiInsights(): Promise<string>;
  addSupport(userId: number, types: string[]): Promise<string>;
  deleteSupport(userId: number): Promise<void>;
  getTicketTypes(): Promise<TicketType[]>;
}
