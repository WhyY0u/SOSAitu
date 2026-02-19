import { useEffect, useState } from 'react';
import ContainerStats from '../administator/components/containerStats/ContainerStats';
import styles from './style/Style.module.css';
import { TicketStatus, type Ticket } from '@/domain/entities/ticket/Ticket';
import CreateTicket from './components/createTicket/createTicket';
import type { User } from '@/domain/entities/user/User';
import ApiUserRepository from '@/data/repositories/user/remote/ApiUserRepository';
import ApiTicketRepository from '@/data/repositories/ticket/remote/ApiTicketRepository';
import TicketListComponent from '../administator/components/ticketList/TicketList';

const UserPage = () => {
  const [counts, setCounts] = useState({ all: 0, new: 0, inProgress: 0, closed: 0 });
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<{ticket: Ticket, user: User}[]>([]);

  const ticketRepository = new ApiTicketRepository();
  const userRepository = new ApiUserRepository();

  useEffect(() => {
    const fetchData = async () => {
      const u = await userRepository.getMe();
      setUser(u);

      const data = await ticketRepository.getTickets(u, { sortBy: 'date', status: 'Все' });
      setTickets(data.items);

      const newCounts = data.items.reduce(
        (acc, ticket) => {
          switch (ticket.status) {
            case TicketStatus.Expectation:
              acc.new += 1;
              break;
            case TicketStatus.InProgress:
              acc.inProgress += 1;
              break;
            case TicketStatus.Completed:
              acc.closed += 1;
              break;
          }
          acc.all += 1;
          return acc;
        },
        { all: 0, new: 0, inProgress: 0, closed: 0 }
      );
      setCounts(newCounts);
    };

    fetchData();
  }, []);

  const handleTicketCreated = (createdTicket: any) => {
    console.log('Ticket created:', createdTicket);
    // Добавляем новый тикет в начало списка в правильном формате
    const newTicketResponse = {
      ticket: {
        id: createdTicket.ticket.id,
        name: createdTicket.ticket.name,
        description: createdTicket.ticket.description,
        type: createdTicket.ticket.type,
        status: createdTicket.ticket.status,
        city: createdTicket.ticket.city,
        region: createdTicket.ticket.region,
        createdTime: createdTicket.ticket.createdTime,
        userId: createdTicket.ticket.userId,
        tags: createdTicket.ticket.tags || [],
        ai_comments: createdTicket.ticket.ai_comments || '',
      },
      user: createdTicket.user, // Сохраняем объект пользователя
    };
    
    setTickets((prev) => [newTicketResponse, ...prev]);
    
    // Обновляем счётчики
    setCounts((prev) => ({
      ...prev,
      all: prev.all + 1,
      new: prev.new + 1,
    }));
  };

  const localName = localStorage.getItem("name")?.trim();
  const displayName = user?.fullName?.trim() || localName || "...";

  return (
    <div className={styles.main_container}>
      <p className={styles.name}>
        Добро пожаловать,<br />
        <span className={styles.name_gradient}>{displayName}!</span>
      </p>
      <p className={styles.ticket_status}>Создавайте тикеты и отслеживайте их статус</p>
      <ContainerStats counts={counts} />
      {user && <CreateTicket user={user} onTicketCreated={handleTicketCreated} />}
      {user && <TicketListComponent list={tickets} mode="user" />}
    </div>
  );
};

export default UserPage;
