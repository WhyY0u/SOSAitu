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
  const [tickets, setTickets] = useState<Ticket[]>([]); // <-- здесь сохраняем тикеты

  const ticketRepository = new ApiTicketRepository();
  const userRepository = new ApiUserRepository();

  useEffect(() => {
    const fetchData = async () => {
      const u = await userRepository.getMe();
      setUser(u);

      const data = await ticketRepository.getTickets(u, { sortBy: 'date', status: 'Все' });
      setTickets(data.items); // <-- сохраняем тикеты

      // Считаем статистику
      const newCounts = data.items.reduce(
        (acc, ticket) => {
          switch (ticket.status) { // <-- ticketStatus на фронте
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

  return (
    <div className={styles.main_container}>
      <p className={styles.name}>
        Добро пожаловать,<br />
        <span className={styles.name_gradient}>{user?.fullName}!</span>
      </p>
      <p className={styles.ticket_status}>Создавайте тикеты и отслеживайте их статус</p>
      <ContainerStats counts={counts} />
      {user && <CreateTicket user={user} />}
      {user && <TicketListComponent user={user} list={tickets} />} 
    </div>
  );
};

export default UserPage;
