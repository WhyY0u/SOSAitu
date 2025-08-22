import { TicketStatus, TicketType, type Ticket } from "@/domain/entities/ticket/Ticket";
import { UserRoles, type User } from "@/domain/entities/user/User";
import type { TicketQuery, TicketRepository } from "@/domain/repositories/ticket/TicketRepository";


const ownerUser: User = {
  id: "1",
  fullname: "Иван Иванов",
  groupsId: [1],
  role: UserRoles.Owner,
};

const adminUser: User = {
  id: "2",
  fullname: "Пётр Петров",
  groupsId: [2],
  role: UserRoles.Administrator,
};

const normalUser: User = {
  id: "3",
  fullname: "Алия Смагулова",
  groupsId: [1, 3],
  role: UserRoles.User,
};

const fakeTickets: Ticket[] = [
  {
    id: "1",
    name: "Запрос помощи ветерану ВОВ",
    userCreate: normalUser,
    moderator: adminUser,
    description: "Необходимо оказать материальную помощь ветерану.",
    createDate: "2025-08-10T10:00:00Z",
    ticketType: TicketType.WWIIVeteran,
    ticketStatus: TicketStatus.New,
    ticketComment: [],
  },
  {
    id: "2",
    name: "Поддержка многодетной семьи",
    userCreate: ownerUser,
    description: "Проблема с получением пособия на детей.",
    createDate: "2025-08-11T12:00:00Z",
    ticketType: TicketType.LargeFamily,
    ticketStatus: TicketStatus.In_Progress,
    ticketComment: [
      {
        description: "Запрос в акимат отправлен.",
        createDate: "2025-08-12T09:00:00Z",
        createUser: adminUser,
      },
    ],
  },
  {
    id: "3",
    name: "Кандас: жильё по госпрограмме",
    userCreate: adminUser,
    description: "Кандас просит разъяснить условия получения жилья.",
    createDate: "2025-08-13T08:30:00Z",
    ticketType: TicketType.Kandas,
    ticketStatus: TicketStatus.Closed,
    ticketComment: [
      {
        description: "Вопрос решён, документы поданы.",
        createDate: "2025-08-14T15:00:00Z",
        createUser: ownerUser,
      },
    ],
  },
];

export class InMemoryTicketRepository implements TicketRepository {
  private tickets: Ticket[];

  constructor() {
    this.tickets = [...fakeTickets];
  }

async getTickets(query?: TicketQuery): Promise<{ total: number; items: Ticket[] }>  {
  let result = [...this.tickets];
  const total = this.tickets.length;

  if (query?.status && query.status !== "Все") {
    result = result.filter(ticket => ticket.ticketStatus === query.status);
  }

  if (query?.sortBy) {
    if (query.sortBy === "date") {
      result.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
    } else if (query.sortBy === "status") {
      result.sort((a, b) => a.ticketStatus.localeCompare(b.ticketStatus));
    }
  }
  
  return { total, items: result };
}


  async getTicketById(id: string): Promise<Ticket | null> {
    return this.tickets.find(t => t.id === id) || null;
  }

  async updateTicket(ticket: Ticket): Promise<void> {
    const index = this.tickets.findIndex(t => t.id === ticket.id);
    if (index !== -1) {
      this.tickets[index] = ticket;
    } else {
      this.tickets.push(ticket);
    }
  }
}