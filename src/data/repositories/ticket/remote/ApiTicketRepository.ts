import apiClient from "@/data/datasources/api/apiClient";
import type { Ticket } from "@/domain/entities/ticket/Ticket";
import type { User } from "@/domain/entities/user/User";
import type {
  TicketQuery,
  TicketRepository,
} from "@/domain/repositories/ticket/TicketRepository";

export default class ApiTicketRepository implements TicketRepository {
  async getTickets(
  user: User,
  query?: TicketQuery
): Promise<{items: Ticket[] }> {
  return (await apiClient.get("/user/tickets", {
    params: {
      status: query?.status,
      sortBy: query?.sortBy,
    },
  })).data;
}


  async createTicket(
    user: User,
    ticket: { title: string; description: string; category: string }
  ): Promise<void> {
    if (!user) throw new Error("User is required");
    await apiClient.post("/user/createTicket", {
      name: ticket.title,
      description: ticket.description,
      type: ticket.category,
    });
  }

  async getTicketById(id: string): Promise<Ticket | null> {
    throw new Error("Method not implemented.");
  }
  async updateTicket(ticket: Ticket): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
