import styles from './styles/Style.module.css'
import ContainerStats from './components/containerStats/ContainerStats';
import SortedContainer from './components/sortedContainer/SortedContainer';
import TicketListComponent from './components/ticketList/TicketList';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

const Home = () => {
    const [selectedStatus, setSelectedStatus] = useState<TicketStatusFilter>("Все");
    const [sortBy, setSortBy] = useState<SortBy>('date');
    const [searchQuery, setSearchQuery] = useState('');
    const [ticketList, setTicketList] = useState<TicketResponse[]>([]);
    const [authUser, setAuthUser] = useState<User | null>(null);

    const ticketRepository = useMemo(() => new ApiAdminTicketRepository(), []);
    const userRepository = useMemo(() => new UserApiRepository(), []);

    useEffect(() => {
        userRepository.getMe().then(u => setAuthUser(u));
    }, [userRepository]);

    useEffect(() => {
        if (!authUser) return;

        ticketRepository.getTickets({ status: "Все" }).then(data => {
            setTicketList(data.items);
        });
    }, [authUser, ticketRepository]);

    const counts = useMemo(() => {
        return ticketList.reduce(
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
    }, [ticketList]);

    const visibleTickets = useMemo(() => {
        const statusFiltered = ticketList.filter((ticketResp) => {
            if (selectedStatus === "Все") return true;
            return ticketResp.ticket.status === selectedStatus;
        });

        const normalizedQuery = searchQuery.trim().toLowerCase();
        const queryFiltered = normalizedQuery
            ? statusFiltered.filter((ticketResp) => {
                const name = ticketResp.ticket.name.toLowerCase();
                const description = ticketResp.ticket.description.toLowerCase();
                return name.includes(normalizedQuery) || description.includes(normalizedQuery);
            })
            : statusFiltered;

        if (sortBy === 'status') {
            const rank: Record<TicketStatus, number> = {
                [TicketStatus.Expectation]: 0,
                [TicketStatus.InProgress]: 1,
                [TicketStatus.Completed]: 2,
            };

            return [...queryFiltered].sort((a, b) => {
                const byStatus = rank[a.ticket.status] - rank[b.ticket.status];
                if (byStatus !== 0) return byStatus;
                return new Date(b.ticket.createdTime).getTime() - new Date(a.ticket.createdTime).getTime();
            });
        }

        return [...queryFiltered].sort((a, b) => {
            return new Date(b.ticket.createdTime).getTime() - new Date(a.ticket.createdTime).getTime();
        });
    }, [searchQuery, selectedStatus, sortBy, ticketList]);

    const handleStatusChange = (status: TicketStatusFilter) => {
        setSelectedStatus(status);
    };

    const handleTicketUpdated = useCallback((updatedTicket: Ticket) => {
        setTicketList((prev) =>
            prev.map((ticketResp) =>
                ticketResp.ticket.id === updatedTicket.id
                    ? { ...ticketResp, ticket: updatedTicket }
                    : ticketResp
            )
        );
    }, []);

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
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <div className={styles.ticket_list_name}>
                <p className={styles.ticket_name}>
                    Тикеты
                    {selectedStatus !== "Все" && (
                        <span className={styles.color_grey}>• {selectedStatus}</span>
                    )}
                </p>
                <p className={styles.ticket_count}>{visibleTickets.length} из {ticketList.length}</p>
            </div>

            {/* Передаем весь TicketResponse в компонент */}
            {authUser && <TicketListComponent list={visibleTickets} mode="admin" onTicketUpdated={handleTicketUpdated} />}
        </div>
    );
};

export default Home;
