import type { Ticket, TicketStatus } from "@/domain/entities/ticket/Ticket";

export type SortBy = "date" | "status" | null;

export interface TicketQuery {
  status?: TicketStatus | "Все";    
  sortBy?: SortBy;
}

export interface TicketRepository {
  getTickets(query?: TicketQuery): Promise<{ total: number; items: Ticket[] }>;
  getTicketById(id: string): Promise<Ticket | null>;
  updateTicket(ticket: Ticket): Promise<void>;
}
