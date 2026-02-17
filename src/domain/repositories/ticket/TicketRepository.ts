import type { Ticket, TicketStatus } from "@/domain/entities/ticket/Ticket";
import type { User } from "@/domain/entities/user/User";

export type SortBy = "date" | "status" | null;

export interface TicketQuery {
  status?: TicketStatus | "Все";    
  sortBy?: SortBy;
}

export interface TicketRepository {
  getTickets(user: User, query?: TicketQuery): Promise<{items: Ticket[] }>;
  getTicketById(id: string, user: User): Promise<Ticket | null>;
  updateTicket(ticket: Ticket): Promise<void>;
  createTicket(user: User, ticket: { title: string; description: string; cityId: number }): Promise<void>;
}
