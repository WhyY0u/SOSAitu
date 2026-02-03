import styles from './styles/Style.module.css'
import ContainerStats from './components/containerStats/ContainerStats';
import SortedContainer from './components/sortedContainer/SortedContainer';
import TicketListComponent from './components/ticketList/TicketList';
import { useEffect, useState } from 'react';
import type { TicketStatusFilter } from './components/sortedStatusContainer/SortedStatusContainer';
import type { SortBy } from './components/sortedClickContainer/SortedClickContainer';
import { TicketStatus, type Ticket } from '@/domain/entities/ticket/Ticket';
import type { User } from '@/domain/entities/user/User';
import ApiAdminTicketRepository from '@/data/repositories/ticket/remote/ApiAdminTicketRepository';
import UserApiRepository from '@/data/repositories/user/remote/ApiUserRepository';

// Новый тип для ответа бекенда
type TicketResponse = {
    ticket: Ticket;
    user: User;
};

type TicketListState = {
    items: TicketResponse[];
};

const Home = () => {
    const [selectedStatus, setSelectedStatus] = useState<TicketStatusFilter>("Все");
    const [sortBy, setSortBy] = useState<SortBy>('date'); 
    const [ticketList, setTicketList] = useState<TicketListState>({ items: [] });
    const [counts, setCounts] = useState({ all: 0, new: 0, inProgress: 0, closed: 0 });
    const [authUser, setAuthUser] = useState<User | null>(null);

    const ticketRepository = new ApiAdminTicketRepository();
    const userRepository = new UserApiRepository();

    useEffect(() => {
        userRepository.getMe().then(u => setAuthUser(u));
    }, []);

    useEffect(() => {
        if (!authUser) return;

        ticketRepository.getTickets({ sortBy, status: selectedStatus }).then(data => {
            setTicketList({ items: data.items }); // теперь это TicketResponse[]

            const newCounts = data.items.reduce(
                (acc, ticketResp) => {
                    switch (ticketResp.ticket.status) {
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
        });
    }, [authUser, sortBy, selectedStatus]);

    const handleStatusChange = (status: TicketStatusFilter) => {
        setSelectedStatus(status);
    };

    return (
        <div className={styles.main_container}>
            <p className={styles.name}>
                Добро пожаловать,<br />
                <span className={styles.name_gradient}>{authUser?.fullName || '...'}</span>
            </p>
            <p className={styles.ticket_status}>
                Сильный не тот, кто судит, а тот, кто помогает
            </p>

            <ContainerStats counts={counts} />

            <SortedContainer
                counts={counts}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onStatusChange={handleStatusChange}
                selectedStatus={selectedStatus}
            />

            <div className={styles.ticket_list_name}>
                <p className={styles.ticket_name}>
                    Тикеты
                    {selectedStatus !== "Все" && (
                        <span className={styles.color_grey}>• {selectedStatus}</span>
                    )}
                </p>
                <p className={styles.ticket_count}>{ticketList.items.length} из {ticketList.items.length}</p>
            </div>

            {/* Передаем весь TicketResponse в компонент */}
            {authUser && <TicketListComponent list={ticketList.items} />}
        </div>
    );
};

export default Home;
