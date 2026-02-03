import type { Ticket, TicketStatus } from "@/domain/entities/ticket/Ticket";
import type { SortBy, TicketQuery } from "./TicketRepository";
import type { User } from "@/domain/entities/user/User";

export interface TicketQueryAdmin {
  sortBy?: SortBy;
  status?: TicketStatus | "Все";
}
export interface TicketResponse {
  ticket: Ticket;
  user: User;
}

export interface AdminTicketRepository {
  getTickets(query?: TicketQuery): Promise<{ items: TicketResponse[] }>;
}
