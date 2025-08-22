import type { TicketQuery, TicketRepository } from "@/domain/repositories/ticket/TicketRepository";
import type { Ticket, TicketType, TicketStatus } from "../../entities/ticket/Ticket";
import type { User } from "@/domain/entities/user/User";

export class TicketService {
  constructor(private repository: TicketRepository) {}

  async getTickets(query?: TicketQuery): Promise<Ticket[]> {
    return await this.repository.getTickets(query);
  }

  async changeStatus(ticketId: string, status: TicketStatus): Promise<void> {
    const ticket = await this.repository.getTicketById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const updated: Ticket = { ...ticket, ticketStatus: status };
    await this.repository.updateTicket(updated);
  }

  async addComment(ticketId: string, description: string, createUser: User): Promise<void> {
    const ticket = await this.repository.getTicketById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const newComment = {
      description,
      createDate: new Date().toISOString(),
      createUser
    };

    const updated: Ticket = {
      ...ticket,
      ticketComment: [...ticket.ticketComment, newComment]
    };

    await this.repository.updateTicket(updated);
  }

  async getByType(type: TicketType): Promise<Ticket[]> {
    return await this.repository.getTickets({ type });
  }
}
